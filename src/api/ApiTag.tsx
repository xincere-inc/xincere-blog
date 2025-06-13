import { AdminApiFactory } from '@/api/client';
import { commonApiFactoryArgs } from './AxiosInstance';

const ApiTag = AdminApiFactory(...commonApiFactoryArgs);

export default ApiTag;
