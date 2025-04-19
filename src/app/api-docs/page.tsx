import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const ApiDocsPage = () => {
  return <SwaggerUI url="/api/docs" />;
};

export default ApiDocsPage;
