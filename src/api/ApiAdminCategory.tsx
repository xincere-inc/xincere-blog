import { AdminApiFactory } from '@/api/client';
import { commonApiFactoryArgs } from './AxiosInstance';

const ApiAdminCategory = AdminApiFactory(...commonApiFactoryArgs);

export default ApiAdminCategory;
