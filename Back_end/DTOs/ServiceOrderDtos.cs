using System;
using System.Collections.Generic;
using HotelManagementAPI.Enums;

namespace HotelManagementAPI.DTOs;

public record ServiceCategoryDto(int Id, string Name);

public record ServiceDto(
    int Id,
    int? CategoryId,
    string Name,
    decimal Price,
    string? Unit
);

public record OrderServiceDetailDto(
    int ServiceId,
    string ServiceName,
    int Quantity,
    decimal UnitPrice,
    decimal LineTotal
);

public record OrderServiceResponseDto(
    int Id,
    int? BookingDetailId,
    DateTime? OrderDate,
    decimal TotalAmount,
    OrderServiceStatus Status,
    List<OrderServiceDetailDto> Details
);

public record CreateOrderServiceItemDto(int ServiceId, int Quantity);

public record CreateOrderServiceRequestDto(
    int BookingDetailId,
    List<CreateOrderServiceItemDto> Items
);

public record UpdateOrderServiceStatusDto(OrderServiceStatus Status);

