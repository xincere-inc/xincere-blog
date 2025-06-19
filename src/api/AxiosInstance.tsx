import { Configuration } from '@/api/client/configuration';
import axios from 'axios';
import { cookies } from 'next/headers';
import { Configuration } from '@/api/client/configuration';

export const axiosInstance = axios.create({
  withCredentials: true,
});

axiosInstance.interceptors.request.use(async (config) => {
  const jwt = (await cookies()).get('jwt');
  if (jwt) {
    config.headers.Authorization = `Bearer ${jwt.value}`;
  }

  return config;
});

// 共通のAPI Factory引数
export const commonApiFactoryArgs = [
  {
    basePath: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
  } as Configuration,
  undefined,
  axiosInstance,
] as const;
