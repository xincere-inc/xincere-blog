import { AdminApiFactory } from './client';
import { commonApiFactoryArgs } from './AxiosInstance';

const ApiAdminArticles = AdminApiFactory(...commonApiFactoryArgs);

export default ApiAdminArticles;
