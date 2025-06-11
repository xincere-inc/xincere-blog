import { AdminApiFactory } from '@/api/client';
import { commonApiFactoryArgs } from './AxiosInstance';

const ApiAdminUsers = AdminApiFactory(...commonApiFactoryArgs);

export default ApiAdminUsers;
