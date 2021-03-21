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
 * Handles ali cloud gateway event options.
 */
export interface HandleAliCloudGatewayEventOptions {
  /**
   * Http request method, default GET.
   */
  httpMethod?: HttpMethod

  /**
   * Whether to encode in base64 or not, default false.
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
   * Request headers, default content type: application/json;charset=UTF-8.
   */
  headers?: Record<string, string>
}

/**
 * Event type.
 */
export type EventType = 'ALI_ClOUD_GATEWAY'

/**
 * Handles the event to buffer options.
 */
export interface HandleEventToBufferOptions {
  /**
   * Event type.
   */
  type: EventType

  /**
   * Event data.
   */
  data: HandleAliCloudGatewayEventOptions
}

/**
 * Handles events turn Buffer.
 */
export interface HandleEventToBufferFunction {
  (options: HandleEventToBufferOptions): Buffer
}

/**
 * Handles the event to buffer.
 */
export interface HandleAliCloudGatewayEventFunction {
  (options: HandleAliCloudGatewayEventOptions): string
}
