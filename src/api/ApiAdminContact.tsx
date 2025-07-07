import { AdminApiFactory } from '@/api/client';
import { commonApiFactoryArgs } from './AxiosInstance';

const ApiAdminContact = AdminApiFactory(...commonApiFactoryArgs);

export default ApiAdminContact;
