import { getApiDocs } from "@/lib/swagger";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"));

const ApiDocsPage = async () => {
  const spec = await getApiDocs();
  return <SwaggerUI spec={spec} />;
};

export default ApiDocsPage;
