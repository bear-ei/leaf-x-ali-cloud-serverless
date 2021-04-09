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
 * Options to handle ali cloud gateway events.
 */
export interface HandleAliCloudGatewayEventOptions {
  /**
   * Http request method.
   */
  httpMethod?: HttpMethod

  /**
   * Whether or not the request body is base64 encoded.
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
 * Serverless request event type.
 */
export type EventType = 'ALI_ClOUD_GATEWAY'

/**
 * Options to handle serverless events to Buffer.
 */
export interface HandleEventToBufferOptions {
  /**
   * Serverless request event type.
   */
  type: EventType

  /**
   * Options to handle ali cloud gateway events.
   */
  data: HandleAliCloudGatewayEventOptions
}

/**
 * Function to handle serverless events to Buffer.
 */
export interface HandleEventToBufferFunction {
  (options: HandleEventToBufferOptions): Buffer
}

/**
 * Function to handle ali cloud gateway events.
 */
export interface HandleAliCloudGatewayEventFunction {
  (options: HandleAliCloudGatewayEventOptions): string
}
