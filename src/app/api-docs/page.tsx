import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const ApiDocsPage = () => {
  return (
    <div>
      <SwaggerUI url="/api/docs" />
    </div>
  );
};

export default ApiDocsPage;
