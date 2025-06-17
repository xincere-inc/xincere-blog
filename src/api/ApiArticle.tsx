import { ArticlesApiFactory } from '@/api/client';
import { commonApiFactoryArgs } from './AxiosInstance';

const ApiArticle = ArticlesApiFactory(...commonApiFactoryArgs);

export default ApiArticle;
