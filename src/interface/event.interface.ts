import {EventTypeString} from '../enum/event.enum';

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
 * Handle serverless trigger event.
 *
 * @param event  TriggerEvent
 * @return HandleGatewayEventOptions
 */
export interface HandleTriggerEvent {
  (event: TriggerEvent): HandleGatewayEventOptions;
}

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
 * Handle the serverless trigger event method.
 */
export interface HandleTriggerEventMethod {
  /**
   * Handle API gateway event.
   */
  readonly gateway: HandleGatewayEvent;
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
