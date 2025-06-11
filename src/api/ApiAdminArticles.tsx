import axios from 'axios';
import { AdminApiFactory } from '@/api/client';
import { Configuration } from '@/api/client/configuration';

const axiosInstance = axios.create();

const ApiAdminArticles = AdminApiFactory(
  {
    basePath: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  } as Configuration,
  undefined,
  axiosInstance
);

export default ApiAdminArticles;