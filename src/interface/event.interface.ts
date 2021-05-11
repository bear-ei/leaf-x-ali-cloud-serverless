/**
 * Event type.
 */
export type EventType = 'GATEWAY';

/**
 * Trigger events.
 */
export interface TriggerEvent {
  /**
   * Event type.
   */
  type: EventType;

  /**
   * Handle gateway event options.
   */
  data: HandleGatewayEventOptions;
}

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
 * Handle event.
 *
 * @param events TriggerEvent
 * @return HandleGatewayEventOptions
 */
export interface HandleEvent {
  (events: TriggerEvent): HandleGatewayEventOptions;
}

/**
 * Handle gateway event options.
 */
export interface HandleGatewayEventOptions {
  /**
   * HTTP request method.
   */
  httpMethod?: HttpMethod;

  /**
   * Whether to base64 encode the request body or not.
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
  headers?: Record<string, unknown>;
}

/**
 * Handle event method.
 */
export interface HandleEventMethod {
  /**
   * Handle gateway event.
   */
  readonly gateway: HandleGatewayEvent;
}

/**
 * Handle gateway event.
 *
 * @param options HandleGatewayEventOptions
 * @return HandleGatewayEventOptions
 */
export interface HandleGatewayEvent {
  (options: HandleGatewayEventOptions): HandleGatewayEventOptions;
}
