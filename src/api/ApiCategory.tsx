import { AdminApiFactory } from '@/api/client';
import { commonApiFactoryArgs } from './AxiosInstance';

const ApiCategory = AdminApiFactory(...commonApiFactoryArgs);

export default ApiCategory;
