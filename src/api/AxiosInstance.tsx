import { Configuration } from '@/api/client/configuration';
import axios from 'axios';

export const axiosInstance = axios.create({
  withCredentials: true,
});

// 共通のAPI Factory引数
export const commonApiFactoryArgs = [
  {
    basePath: process.env.NEXT_PUBLIC_API_URL ?? 'https://localhost:3000',
  } as Configuration,
  undefined,
  axiosInstance,
] as const;
