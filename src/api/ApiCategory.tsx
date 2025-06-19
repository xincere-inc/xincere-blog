import { CategoriesApiFactory } from '@/api/client';
import { commonApiFactoryArgs } from './AxiosInstance';

const ApiCategory = CategoriesApiFactory(...commonApiFactoryArgs);

export default ApiCategory;
