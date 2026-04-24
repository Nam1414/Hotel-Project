import axiosClient from '../api/axiosClient';
import type { BookingResponseDto } from './bookingApi';

export type OrderServiceStatus = 'Pending' | 'Delivered' | 'Cancelled';

export interface ServiceCategoryDto {
  id: number;
  name: string;
}

export interface ServiceDto {
  id: number;
  categoryId?: number | null;
  name: string;
  price: number;
  unit?: string | null;
}

export interface OrderServiceDetailDto {
  serviceId: number;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderServiceResponseDto {
  id: number;
  bookingDetailId?: number | null;
  orderDate?: string | null;
  totalAmount: number;
  status: OrderServiceStatus;
  details: OrderServiceDetailDto[];
}

export interface CreateOrderServiceItemDto {
  serviceId: number;
  quantity: number;
}

export interface CreateOrderServiceRequestDto {
  bookingDetailId: number;
  items: CreateOrderServiceItemDto[];
}

export interface UpdateOrderServiceStatusDto {
  status: OrderServiceStatus;
}

export const serviceOrderApi = {
  getCategories: async (): Promise<ServiceCategoryDto[]> =>
    (await axiosClient.get('/api/Services/categories')) as unknown as ServiceCategoryDto[],

  getServices: async (): Promise<ServiceDto[]> =>
    (await axiosClient.get('/api/Services')) as unknown as ServiceDto[],

  getBookingsForManagement: async (): Promise<BookingResponseDto[]> =>
    (await axiosClient.get('/api/OrderServices/bookings')) as unknown as BookingResponseDto[],

  getOrdersByBookingId: async (bookingId: number): Promise<OrderServiceResponseDto[]> =>
    (await axiosClient.get(`/api/OrderServices/booking/${bookingId}`)) as unknown as OrderServiceResponseDto[],

  createOrder: async (dto: CreateOrderServiceRequestDto): Promise<OrderServiceResponseDto> =>
    (await axiosClient.post('/api/OrderServices', dto)) as unknown as OrderServiceResponseDto,

  updateStatus: async (id: number, dto: UpdateOrderServiceStatusDto): Promise<{ success: boolean }> =>
    (await axiosClient.put(`/api/OrderServices/${id}/status`, dto)) as unknown as { success: boolean },
};

