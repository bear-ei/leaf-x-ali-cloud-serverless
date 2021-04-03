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
 * Options to handle ali cloud gateway request events.
 */
export interface HandleAliCloudGatewayEventOptions {
  /**
   * Http request method.
   */
  httpMethod?: HttpMethod

  /**
   * Whether the request entity is base64 encoded.
   */
  isBase64Encoded?: boolean

  /**
   * The query parameters for the request event.
   */
  queryParameters?: Record<string, unknown>

  /**
   * The path parameter of the request event.
   */
  pathParameters?: Record<string, string>

  /**
   * The request body of the request event.
   */
  body?: unknown

  /**
   * The request headers of the request event.
   */
  headers?: Record<string, string>
}

/**
 * The serverless event type.
 */
export type EventType = 'ALI_ClOUD_GATEWAY'

/**
 * Options to handle the request event to buffer.
 */
export interface HandleEventToBufferOptions {
  /**
   * The serverless event type.
   */
  type: EventType

  /**
   * The data that needs to be converted to buffer.
   */
  data: HandleAliCloudGatewayEventOptions
}

/**
 * The function that handles the request event to buffer.
 */
export interface HandleEventToBufferFunction {
  (options: HandleEventToBufferOptions): Buffer
}

/**
 * Function to handle ali cloud gateway request events.
 */
export interface HandleAliCloudGatewayEventFunction {
  (options: HandleAliCloudGatewayEventOptions): string
}
