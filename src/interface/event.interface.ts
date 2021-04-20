/**
 * Event type.
 */
export type EventType = 'GATEWAY'

/**
 * Trigger events.
 */
export interface TriggerEvent {
  /**
   * Event type.
   */
  type: EventType

  /**
   * Trigger event data.
   */
  data: HandleGatewayEventOptions
}

/**
 * Http request method.
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
  | 'UNLINK'

/**
 * Handle the event.
 *
 * @param options TriggerEvent
 * @return HandleGatewayEventOptions
 */
export interface HandleEvent {
  (options: TriggerEvent): HandleGatewayEventOptions
}

/**
 * Handles gateway event options.
 */
export interface HandleGatewayEventOptions {
  /**
   * Http request method.
   */
  httpMethod?: HttpMethod

  /**
   * Whether to base64 encode the request body.
   */
  isBase64Encoded?: boolean

  /**
   * Query parameters.
   */
  queryParameters?: Record<string, unknown>

  /**
   * Path parameters.
   */
  pathParameters?: Record<string, string>

  /**
   * Request body.
   */
  body?: unknown

  /**
   * Request headers.
   */
  headers?: Record<string, unknown>
}

/**
 * Handles gateway events.
 *
 * @param options HandleGatewayEventOptions
 * @return HandleGatewayEventOptions
 */
export interface HandleGatewayEvent {
  (options: HandleGatewayEventOptions): HandleGatewayEventOptions
}
