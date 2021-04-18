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
   * Gateway options.
   *
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
 */
export interface HandleEvent {
  (options: TriggerEvent): HandleGatewayEventOptions
}

/**
 * Handle gateway event options.
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
  headers?: Record<string, string>
}

/**
 * Handle gateway events.
 */
export interface HandleGatewayEvent {
  (options: HandleGatewayEventOptions): HandleGatewayEventOptions
}
