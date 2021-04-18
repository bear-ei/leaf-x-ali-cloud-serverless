/**
 * Handle Error options.
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
   * Running environment.
   */
  env: string

  /**
   * Request ID.
   */
  requestId?: string
}

/**
 * Handle error results.
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
   * Error message.
   */
  message: string

  /**
   * API invoke chain information.
   */
  apis?: HandleErrorOptions[]

  /**
   * Error details.
   */
  details?: unknown
}

/**
 * Handle error.
 *
 * @param error Error.
 */
export interface HandleError {
  (
    error: Record<string, unknown>,
    options: HandleErrorOptions
  ): HandleErrorResult
}

/**
 * Handle serverless error.
 *
 * @param error Error.
 */
export interface HandleServerlessError {
  (options: HandleErrorOptions): (error: Record<string, unknown>) => never
}
