import axios from 'axios';
import { cookies } from 'next/headers';

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
