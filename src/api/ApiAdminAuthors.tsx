import { AdminApiFactory } from "./client";
import { commonApiFactoryArgs } from "./AxiosInstance";

const ApiAdminAuthors = AdminApiFactory(...commonApiFactoryArgs);

export default ApiAdminAuthors;