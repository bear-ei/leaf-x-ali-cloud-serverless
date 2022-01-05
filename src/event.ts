/**
 * Enumerates serverless event types.
 */
export enum EventType {
  GATEWAY = 'gateway',
}

/**
 * Serverless event type string.
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
 * Options for handle API gateway trigger event.
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
   * Query parameters.
   */
  queryParameters?: Record<string, unknown>;

  /**
   * Path parameters.
   */
  pathParameters?: Record<string, string>;

  /**
   * Request body.
   */
  body?: unknown;

  /**
   * Request headers.
   */
  headers?: Record<string, string>;
}

/**
 * Serverless trigger event.
 */
export interface TriggerEvent {
  /**
   * Serverless trigger event type.
   */
  type: EventTypeString;

  /**
   * Serverless trigger event data.
   */
  data: HandleGatewayEventOptions;
}

/**
 * Handle serverless trigger event.
 *
 * @param event  TriggerEvent
 * @return HandleGatewayEventOptions
 */
export interface HandleTriggerEvent {
  (event: TriggerEvent): HandleGatewayEventOptions;
}

/**
 * Handle API gateway event.
 *
 * @param options HandleGatewayEventOptions
 * @return HandleGatewayEventOptions
 */
export interface HandleGatewayEvent {
  (options: HandleGatewayEventOptions): HandleGatewayEventOptions;
}

/**
 * Handle the serverless trigger event method.
 */
export interface HandleTriggerEventMethod {
  /**
   * Handle API gateway event.
   */
  readonly gateway: HandleGatewayEvent;
}

const handleGatewayEvent: HandleGatewayEvent = ({
  httpMethod = 'GET',
  isBase64Encoded = false,
  queryParameters = {},
  pathParameters = {},
  body = {},
  headers = {},
}) => {
  const {
    'content-type': contentType = 'application/json; charset=utf-8',
    accept = '*/*',
    ...args
  } = headers;

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
