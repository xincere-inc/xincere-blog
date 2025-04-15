import axios from 'axios';

import { AuthApiFactory } from '@/api/client';
import { Configuration } from '@/api/client/configuration';

const axiosInstance = axios.create();

const IdoAuth = AuthApiFactory(
  {
    basePath: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  } as Configuration,
  undefined,
  axiosInstance
);

export default IdoAuth;
