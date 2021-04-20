/**
 * Handle the error options.
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
 * The result of a handling error.
 *
 * @extends HandleErrorOptions
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
 * @param error     Error.
 * @param options   HandleErrorOptions
 * @return HandleErrorResult
 */
export interface HandleError {
  (
    error: Record<string, unknown>,
    options: HandleErrorOptions
  ): HandleErrorResult
}

/**
 * Initialize to handle serverless errors.
 *
 * @param options HandleErrorOptions
 * @return HandleServerlessError
 */
export interface InitHandleServerlessError {
  (options: HandleErrorOptions): HandleServerlessError
}

/**
 * Handle serverless errors.
 *
 * @param error Error.
 * @return never
 */
export interface HandleServerlessError {
  (error: Record<string, unknown>): never
}
