import * as SecureStore from 'expo-secure-store';
import { post } from '../config/axiosConfig';

export async function requestOtp(phone: string): Promise<{ ttlSeconds: number }> {
  if (!phone) throw new Error('Phone required');
  const res: any = await post('/api/v1/auth/otp/request', { phone });
  return res as { ttlSeconds: number };
}

export async function verifyOtp(phone: string, code: string): Promise<{ token: string; user: any }> {
  if (!phone || !code) throw new Error('Phone and code required');
  const res: any = await post('/api/v1/auth/otp/verify', { phone, code });
  const token = res?.token;
  if (token) {
    await SecureStore.setItemAsync('token', token);
    await SecureStore.setItemAsync('user', JSON.stringify(res.user ?? {}));
  }
  return res as { token: string; user: any };
}

export async function getToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync('token');
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');
  } catch {}
}


