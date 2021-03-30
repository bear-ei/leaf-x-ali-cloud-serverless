/**
 * Handles the error option.
 */
export interface HandleErrorOptions {
  /**
   * Service name.
   */
  serviceName: string

  /**
   * Function name.
   */
  functionName: string

  /**
   * Request ID.
   */
  requestId: string

  /**
   * Running environment.
   */
  env: string
}

/**
 * Handles the error results.
 */
export interface HandleErrorResult extends HandleErrorOptions {
  /**
   * Response status code.
   */
  status: number

  /**
   * Custom error codes.
   */
  code: number

  /**
   * Error message.
   */
  message: string

  /**
   * Api call chain.
   */
  apis?: HandleErrorOptions[]

  /**
   * Error details.
   */
  details?: unknown
}

/**
 * Handles Errors.
 *
 * @param error Error.
 */
export interface HandleErrorFunction {
  (
    error: Record<string, unknown>,
    options: HandleErrorOptions
  ): HandleErrorResult
}

/**
 * Handles request errors.
 *
 * @param error Error.
 */
export interface HandleRequestErrorFunction {
  (error: Record<string, unknown>, options: HandleErrorOptions): never
}
