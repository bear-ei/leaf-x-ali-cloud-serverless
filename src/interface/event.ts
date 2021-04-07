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
  | 'UNLINK'

/**
 * Handle ali cloud Gateway event options.
 */
export interface HandleAliCloudGatewayEventOptions {
  /**
   * HTTP request method.
   */
  httpMethod?: HttpMethod

  /**
   * If or not to base64 encode the body.
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
 * Serverless event type.
 */
export type EventType = 'ALI_ClOUD_GATEWAY'

/**
 * Handle the event to buffer options.
 */
export interface HandleEventToBufferOptions {
  /**
   * Serverless event type.
   */
  type: EventType

  /**
   * Handle ali cloud Gateway event options.
   */
  data: HandleAliCloudGatewayEventOptions
}

/**
 * Handle the event to buffer.
 */
export interface HandleEventToBufferFunction {
  (options: HandleEventToBufferOptions): Buffer
}

/**
 * Handle ali cloud gateway events.
 */
export interface HandleAliCloudGatewayEventFunction {
  (options: HandleAliCloudGatewayEventOptions): string
}
