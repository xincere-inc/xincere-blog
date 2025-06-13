import { ContactApiFactory } from '@/api/client';
import { commonApiFactoryArgs } from './AxiosInstance';

const ApiContact = ContactApiFactory(...commonApiFactoryArgs);

export default ApiContact;
