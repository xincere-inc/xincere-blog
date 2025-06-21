import { CommentsApiFactory } from '@/api/client';
import { commonApiFactoryArgs } from './AxiosInstance';

const ApiCommentArticle = CommentsApiFactory(...commonApiFactoryArgs);

export default ApiCommentArticle;
