import { AuthApiFactory } from '@/api/client';
import { commonApiFactoryArgs } from './AxiosInstance';

const ApiAuth = AuthApiFactory(...commonApiFactoryArgs);

export default ApiAuth;
