import {EventType} from './enum/event.enum';
import {
  HandleGatewayEvent,
  HandleTriggerEvent,
  HandleTriggerEventMethod,
} from './interface/event.interface';

const handleGatewayEvent: HandleGatewayEvent = ({
  httpMethod = 'GET',
  isBase64Encoded = false,
  queryParameters = {},
  pathParameters = {},
  body = {},
  headers,
}) => {
  const {
    'content-type': contentType = 'application/json; charset=utf-8',
    accept = '*/*',
    ...args
  } = headers ?? {};

  const data = (contentType as string).startsWith('application/json')
    ? JSON.stringify(body)
    : body;

  return {
    httpMethod,
    isBase64Encoded,
    queryParameters,
    pathParameters,
    body: data,
    headers: {'content-type': contentType, accept, ...args},
  };
};

export const handleTriggerEvent: HandleTriggerEvent = ({type, data}) => {
  const handleEventMethod: HandleTriggerEventMethod = Object.freeze({
    gateway: handleGatewayEvent,
  });

  return handleEventMethod[EventType[type]](data);
};
