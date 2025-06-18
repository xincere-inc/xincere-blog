import { AdminApiFactory } from '@/api/client';
import { commonApiFactoryArgs } from './AxiosInstance';

const ApiAdminTag = AdminApiFactory(...commonApiFactoryArgs);

export default ApiAdminTag;
