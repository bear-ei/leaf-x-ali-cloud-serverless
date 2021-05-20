import {EventTypeString} from '../enum/event.enum';

/**
 * Trigger event.
 */
export interface TriggerEvent {
  /**
   * Trigger event type.
   */
  type: EventTypeString;

  /**
   * Trigger event data.
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
 * Handle trigger event.
 *
 * @param event  TriggerEvent
 * @return HandleGatewayEventOptions
 */
export interface HandleTriggerEvent {
  (event: TriggerEvent): HandleGatewayEventOptions;
}

/**
 * Handle gateway trigger event options.
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
  headers?: Record<string, unknown>;
}

/**
 * Handle the trigger event method.
 */
export interface HandleTriggerEventMethod {
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
