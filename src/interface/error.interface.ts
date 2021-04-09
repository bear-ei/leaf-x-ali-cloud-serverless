/**
 * Options to handle error messages when an error occurs.
 */
export interface HandleErrorOptions {
  /**
   * Name of the service where the error occurred.
   */
  serviceName: string

  /**
   * Name of the function where the error occurred.
   */
  functionName: string

  /**
   * Request id of the error occurred.
   */
  requestId: string

  /**
   * Operating environment where the error occurred.
   */
  env: string
}

/**
 * Result of processing error messages when an error occurs.
 */
export interface HandleErrorResult extends HandleErrorOptions {
  /**
   * Error response status code.
   */
  status: number

  /**
   * Error business status code.
   */
  code: number

  /**
   * Error description message.
   */
  message: string

  /**
   * Invoke chain where the error occurred.
   */
  apis?: HandleErrorOptions[]

  /**
   * Error details.
   */
  details?: unknown
}

/**
 * Function to handle error messages.
 *
 * @param error Error message.
 */
export interface HandleErrorFunction {
  (
    error: Record<string, unknown>,
    options: HandleErrorOptions
  ): HandleErrorResult
}

/**
 * Function to handle request error messages.
 *
 * @param error Error message.
 */
export interface HandleRequestErrorFunction {
  (error: Record<string, unknown>, options: HandleErrorOptions): never
}
