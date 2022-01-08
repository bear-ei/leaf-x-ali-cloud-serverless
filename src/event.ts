/**
 * Event type enumeration.
 */
export enum EventType {
  GATEWAY = 'gateway',
}

/**
 * Event type string.
 */
export type EventTypeString = 'GATEWAY';

/**
 * HTTP request method.
 */
export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS'
  | 'PUT'
  | 'PATCH'
  | 'PURGE'
  | 'LINK'
  | 'UNLINK';

/**
 * Handle API gateway event options.
 */
export interface HandleGatewayEventOptions {
  /**
   * HTTP request method.
   */
  httpMethod?: HttpMethod;

  /**
   * Whether to encode the request body in base64 or not.
   */
  isBase64Encoded?: boolean;

  /**
   * Request query parameters.
   */
  queryParameters?: Record<string, unknown>;

  /**
   * Request path parameters.
   */
  pathParameters?: Record<string, string>;

  /**
   * Request body.
   */
  body?: unknown;

  /**
   * Request headers information.
   */
  headers?: Record<string, string>;
}

/**
 * Handles API gateway events.
 *
 * @param options Handle API gateway event options.
 */
const handleGatewayEvent = ({
  httpMethod = 'GET',
  isBase64Encoded = false,
  queryParameters = {},
  pathParameters = {},
  body = {},
  headers = {},
}: HandleGatewayEventOptions) => {
  const {
    'content-type': contentType = 'application/json; charset=utf-8',
    accept = '*/*',
    ...args
  } = headers;

  const data = contentType.startsWith('application/json')
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

/**
 * Handle trigger events.
 *
 * @param options Event type string.
 * @param data Handle API gateway event options.
 */
export const handleTriggerEvent = (
  type: EventTypeString,
  data: HandleGatewayEventOptions
) => {
  const handleEventMethod = Object.freeze({
    gateway: handleGatewayEvent,
  });

  return handleEventMethod[EventType[type]](data);
};
