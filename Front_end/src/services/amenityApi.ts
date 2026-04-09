import axiosClient from '../api/axiosClient';

export interface AmenityDto {
  id: number;
  name: string;
  iconUrl?: string | null;
}

export const amenityApi = {
  getAll: async (): Promise<AmenityDto[]> =>
    (await axiosClient.get('/api/Amenities')) as AmenityDto[],

  create: async (dto: { name: string; iconUrl?: string }) =>
    axiosClient.post('/api/Amenities', dto),

  update: async (id: number, dto: { name: string; iconUrl?: string }) =>
    axiosClient.put(`/api/Amenities/${id}`, dto),

  delete: async (id: number) =>
    axiosClient.delete(`/api/Amenities/${id}`),

  linkToRoomType: async (roomTypeId: number, amenityId: number) =>
    axiosClient.post(`/api/Amenities/link/${roomTypeId}/${amenityId}`),

  unlinkFromRoomType: async (roomTypeId: number, amenityId: number) =>
    axiosClient.delete(`/api/Amenities/link/${roomTypeId}/${amenityId}`),
};

