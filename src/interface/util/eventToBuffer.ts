/**
 * Ali cloud gateway event options.
 */
export interface EventOptions {
  /**
   * Http request method, default value GET.
   */
  httpMethod?:
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
  body?: Record<string, unknown>

  /**
   * Request headers, default content-type: application/json; charset=utf-8.
   */
  headers?: Record<string, string>
}

/**
 * Ali cloud gateway event to buffer.
 */
export interface EventToBufferFunction {
  (options: EventOptions): Buffer
}
