import axios from 'axios';
import { BASE_URL } from './axiosInstance';

// Dùng axios thuần (không qua interceptor) để tránh vòng lặp refresh
const plainAxios = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const authApi = {
  login: async (dto: { email: string; password: string }) => {
    const res = await plainAxios.post('/Auth/login', dto);
    return res.data as {
      accessToken: string;
      fullName: string;
      email: string;
      role: string;
      permissions: string[];
    };
  },

  logout: async () => {
    const token = localStorage.getItem('token');
    await plainAxios.post(
      '/Auth/logout',
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },

  refreshToken: async (accessToken: string) => {
    const res = await plainAxios.post('/Auth/refresh-token', { accessToken });
    return res.data as { accessToken: string };
  },
};
