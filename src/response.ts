import {EventType} from './enum/event.enum';
import {
  HandleGatewayResponse,
  HandleGatewayResponseOptions,
  HandleResponse,
  HandleResponseMethod,
} from './interface/response.interface';

const handleGatewayResponse: HandleGatewayResponse = ({
  statusCode,
  headers,
  body,
  isBase64Encoded,
}) => {
  const originalBody = isBase64Encoded
    ? Buffer.from(body as string, 'base64').toString()
    : body;

  const data = headers['content-type']?.startsWith('application/json')
    ? JSON.parse(originalBody as string)
    : originalBody;

  const result = {status: statusCode, headers, data};
  const error = result.status < 200 || result.status >= 300;

  if (error) {
    throw Object.assign(new Error('Invalid response.'), {...data});
  }

  return result;
};

export const handleResponse: HandleResponse = ({type, response}) => {
  const handleResponseMethod: HandleResponseMethod = Object.freeze({
    gateway: handleGatewayResponse,
  });

  if (response.status === 202) {
    return response;
  }

  return handleResponseMethod[EventType[type]](
    response.data as HandleGatewayResponseOptions
  );
};
