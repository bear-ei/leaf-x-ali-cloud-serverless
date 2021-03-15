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
 * Handle AliCloud gateway event options.
 */
export interface HandleAliCloudGatewayEventOptions {
  /**
   * Http request method, default value GET.
   */
  httpMethod?: HttpMethod

  /**
   * Whether to encode the request body in base64, default value false.
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
   * Request headers, default content-type: application/json; charset=utf-8.
   */
  headers?: Record<string, string>
}

/**
 * Event type.
 */
export type EventType = 'ALI_ClOUD_GATEWAY'

/**
 * Event to buffer options.
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
 * Handle event to buffer.
 */
export interface HandleEventToBufferFunction {
  (options: HandleEventToBufferOptions): Buffer
}

/**
 * Handle AliCloud gateway event.
 */
export interface HandleAliCloudGatewayEventFunction {
  (options: HandleAliCloudGatewayEventOptions): string
}
