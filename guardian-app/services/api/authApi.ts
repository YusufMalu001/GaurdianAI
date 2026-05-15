import Config from '../../constants/config';
import { request } from './http';

const BASE = Config.API_BASE_URL;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const authApi = {
  login(email: string, password: string) {
    return request<AuthResponse>(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  },

  register(name: string, email: string, phone: string, password: string) {
    return request<AuthResponse>(`${BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password }),
    });
  },

  logout(token: string) {
    return request<{ message: string }>(`${BASE}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
