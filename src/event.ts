/**
 * Trigger event type enumeration.
 */
export enum EventType {
  GATEWAY = 'gateway',
}

/**
 * Trigger event type enumeration string.
 */
export type EventTypeString = 'GATEWAY';

/**
 * Trigger event HTTP request method.
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
   * Trigger event HTTP request method.
   */
  httpMethod?: HttpMethod;

  /**
   * Whether the event body is base64 encoded or not.
   *
   * The default value is true.
   */
  isBase64Encoded?: boolean;

  /**
   * Event query params.
   */
  queryParameters?: Record<string, unknown>;

  /**
   * Event path params.
   */
  pathParameters?: Record<string, string>;

  /**
   * Event body.
   */
  body?: unknown;

  /**
   * Event request headers information.
   */
  headers?: Record<string, string>;
}

/**
 * Handle API gateway event.
 *
 * @param options Handle API gateway event options.
 */
const handleGatewayEvent = ({
  httpMethod = 'GET',
  isBase64Encoded = true,
  queryParameters = {},
  pathParameters = {},
  body,
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
    body: data ? Buffer.from(data as string).toString('base64') : data,
    headers: {'content-type': contentType, accept, ...args},
  };
};

/**
 * Handle trigger event.
 *
 * @param type Trigger event type.
 * @param options Handle API gateway event options.
 */
export const handleTriggerEvent = (
  type: EventTypeString,
  options: HandleGatewayEventOptions
) => {
  const handleEventMethods = Object.freeze({
    gateway: handleGatewayEvent,
  });

  return handleEventMethods[EventType[type]](options);
};
