import axiosClient from '../api/axiosClient';

// ─── Types ─────────────────────────────────────────────────────────────────
export type BookingStatus = 'Pending' | 'Confirmed' | 'CheckedIn' | 'CheckedOut' | 'Cancelled';
export type InvoiceStatus = 'Unpaid' | 'PartiallyPaid' | 'Paid' | 'Cancelled';

export interface BookingDetailDto {
  id: number;
  roomId?: number | null;
  roomTypeId?: number | null;
  checkInDate: string;
  checkOutDate: string;
  pricePerNight: number;
}

export interface BookingResponseDto {
  id: number;
  userId?: number | null;
  guestName?: string | null;
  guestPhone?: string | null;
  guestEmail?: string | null;
  bookingCode: string;
  voucherId?: number | null;
  voucherCode?: string | null;
  status: BookingStatus;
  details: BookingDetailDto[];
  invoiceId?: number | null;
  depositAmount: number;
}

export interface CreateBookingDetailDto {
  roomId?: number | null;
  roomTypeId?: number | null;
  checkInDate: string;
  checkOutDate: string;
  pricePerNight: number;
}

export interface CreateBookingRequestDto {
  userId?: number | null;
  guestName?: string | null;
  guestPhone?: string | null;
  guestEmail?: string | null;
  voucherId?: number | null;
  details: CreateBookingDetailDto[];
  depositAmount?: number;
}

export interface UpdateBookingStatusDto {
  status: number; // BookingStatus enum index
}

export interface PaymentResponseDto {
  id: number;
  paymentMethod: string;
  amountPaid: number;
  transactionCode?: string | null;
  paymentDate?: string | null;
}

export interface InvoiceResponseDto {
  id: number;
  bookingId?: number | null;
  totalRoomAmount: number;
  totalServiceAmount: number;
  discountAmount: number;
  taxAmount: number;
  finalTotal: number;
  status: InvoiceStatus;
  payments: PaymentResponseDto[];
  serviceOrders?: any[];
  lossDamages?: any[];
  depositAmount: number;
}

export interface AddPaymentDto {
  paymentMethod: string;
  amountPaid: number;
  transactionCode?: string | null;
}

// ─── Status index map ───────────────────────────────────────────────────────
export const BOOKING_STATUS_INDEX: Record<BookingStatus, number> = {
  Pending: 0,
  Confirmed: 1,
  CheckedIn: 2,
  CheckedOut: 3,
  Cancelled: 4,
};

// ─── API ────────────────────────────────────────────────────────────────────
export const bookingApi = {
  getAll: async (): Promise<BookingResponseDto[]> =>
    (await axiosClient.get('/api/Booking')) as unknown as BookingResponseDto[],

  getById: async (id: number): Promise<BookingResponseDto> =>
    (await axiosClient.get(`/api/Booking/${id}`)) as unknown as BookingResponseDto,

  create: async (dto: CreateBookingRequestDto): Promise<BookingResponseDto> =>
    (await axiosClient.post('/api/Booking', dto)) as unknown as BookingResponseDto,

  updateStatus: async (id: number, status: BookingStatus): Promise<BookingResponseDto> =>
    (await axiosClient.put(`/api/Booking/${id}/status`, {
      status: BOOKING_STATUS_INDEX[status],
    })) as unknown as BookingResponseDto,

  getInvoiceByBookingId: async (bookingId: number): Promise<InvoiceResponseDto> =>
    (await axiosClient.get(`/api/Invoice/booking/${bookingId}`)) as unknown as InvoiceResponseDto,

  createInvoice: async (bookingId: number): Promise<InvoiceResponseDto> =>
    (await axiosClient.post(`/api/Invoice/booking/${bookingId}`)) as unknown as InvoiceResponseDto,

  addPayment: async (invoiceId: number, dto: AddPaymentDto): Promise<PaymentResponseDto> =>
    (await axiosClient.post(`/api/Invoice/${invoiceId}/payment`, dto)) as unknown as PaymentResponseDto,
};
