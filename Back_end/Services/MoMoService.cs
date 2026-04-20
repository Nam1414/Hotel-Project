using System;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using HotelManagementAPI.DTOs;
using Microsoft.Extensions.Configuration;

namespace HotelManagementAPI.Services
{
    public interface IMoMoService
    {
        Task<MoMoCreatePaymentResponseDto> CreatePaymentAsync(int invoiceId, decimal amount, string orderInfo);
        bool VerifyIpnSignature(MoMoNotifyDto notify);
    }

    public class MoMoService : IMoMoService
    {
        private readonly IConfiguration _config;
        private readonly IHttpClientFactory _httpClientFactory;

        private string MomoApiUrl => _config["MoMoAPI:MomoApiUrl"] ?? "https://test-payment.momo.vn/v2/gateway/api/create";
        private string SecretKey => _config["MoMoAPI:SecretKey"] ?? "";
        private string AccessKey => _config["MoMoAPI:AccessKey"] ?? "";
        private string PartnerCode => _config["MoMoAPI:PartnerCode"] ?? "";
        private string RequestType => _config["MoMoAPI:RequestType"] ?? "captureWallet";
        private string ReturnUrl => _config["MoMoAPI:ReturnUrl"] ?? "";
        private string NotifyUrl => _config["MoMoAPI:NotifyUrl"] ?? "";

        public MoMoService(IConfiguration config, IHttpClientFactory httpClientFactory)
        {
            _config = config;
            _httpClientFactory = httpClientFactory;
        }

        public async Task<MoMoCreatePaymentResponseDto> CreatePaymentAsync(int invoiceId, decimal amount, string orderInfo)
        {
            var orderId = $"INVOICE-{invoiceId}-{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}";
            var requestId = Guid.NewGuid().ToString("N");
            var amountLong = (long)Math.Round(amount);
            var extraData = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{{\"invoiceId\":{invoiceId}}}"));

            // Build returnUrl với invoiceId để frontend biết reload invoice nào
            var returnUrl = $"{ReturnUrl}&invoiceId={invoiceId}";

            // Tạo raw signature string theo đúng thứ tự MoMo yêu cầu
            var rawSignature =
                $"accessKey={AccessKey}" +
                $"&amount={amountLong}" +
                $"&extraData={extraData}" +
                $"&ipnUrl={NotifyUrl}" +
                $"&orderId={orderId}" +
                $"&orderInfo={orderInfo}" +
                $"&partnerCode={PartnerCode}" +
                $"&redirectUrl={returnUrl}" +
                $"&requestId={requestId}" +
                $"&requestType={RequestType}";

            var signature = ComputeHmacSha256(rawSignature, SecretKey);

            var requestBody = new
            {
                partnerCode = PartnerCode,
                partnerName = "Kant Hotel",
                storeId = "KantHotel",
                requestId = requestId,
                amount = amountLong,
                orderId = orderId,
                orderInfo = orderInfo,
                redirectUrl = returnUrl,
                ipnUrl = NotifyUrl,
                lang = "vi",
                extraData = extraData,
                requestType = RequestType,
                signature = signature
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var client = _httpClientFactory.CreateClient("MoMo");
            var response = await client.PostAsync(MomoApiUrl, content);
            var responseBody = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(responseBody);
            var root = doc.RootElement;

            var resultCode = root.TryGetProperty("resultCode", out var rc) ? rc.GetInt32() : -1;
            var message = root.TryGetProperty("message", out var msg) ? msg.GetString() : "Unknown error";
            var payUrl = root.TryGetProperty("payUrl", out var pu) ? pu.GetString() : null;
            var deeplink = root.TryGetProperty("deeplink", out var dl) ? dl.GetString() : null;
            var qrCodeUrl = root.TryGetProperty("qrCodeUrl", out var qr) ? qr.GetString() : null;

            if (resultCode != 0)
            {
                throw new Exception($"MoMo Error [{resultCode}]: {message}");
            }

            return new MoMoCreatePaymentResponseDto
            {
                PayUrl = payUrl ?? string.Empty,
                Deeplink = deeplink,
                QrCodeUrl = qrCodeUrl,
                OrderId = orderId,
                RequestId = requestId,
                InvoiceId = invoiceId,
                Amount = amountLong
            };
        }

        public bool VerifyIpnSignature(MoMoNotifyDto notify)
        {
            // Raw signature theo thứ tự MoMo IPN spec
            var rawSignature =
                $"accessKey={AccessKey}" +
                $"&amount={notify.Amount}" +
                $"&extraData={notify.ExtraData}" +
                $"&message={notify.Message}" +
                $"&orderId={notify.OrderId}" +
                $"&orderInfo={notify.OrderInfo}" +
                $"&orderType={notify.OrderType}" +
                $"&partnerCode={notify.PartnerCode}" +
                $"&payType={notify.PayType}" +
                $"&requestId={notify.RequestId}" +
                $"&responseTime={notify.ResponseTime}" +
                $"&resultCode={notify.ResultCode}" +
                $"&transId={notify.TransId}";

            var expectedSig = ComputeHmacSha256(rawSignature, SecretKey);
            return string.Equals(expectedSig, notify.Signature, StringComparison.OrdinalIgnoreCase);
        }

        private static string ComputeHmacSha256(string message, string secretKey)
        {
            var keyBytes = Encoding.UTF8.GetBytes(secretKey);
            var msgBytes = Encoding.UTF8.GetBytes(message);
            using var hmac = new HMACSHA256(keyBytes);
            var hashBytes = hmac.ComputeHash(msgBytes);
            return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
        }
    }
}
