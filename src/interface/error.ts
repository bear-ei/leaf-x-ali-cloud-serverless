/**
 * Handle the error options.
 */
export interface HandleErrorOptions {
  /**
   * Name of the error service.
   */
  serviceName: string

  /**
   * Name of the error function.
   */
  functionName: string

  /**
   * Request id.
   */
  requestId: string

  /**
   * The current operating environment.
   */
  env: string
}

/**
 * Handle the error results.
 */
export interface HandleErrorResult extends HandleErrorOptions {
  /**
   * Response status code.
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
   * Error API access chain.
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
export interface HandleErrorFunction {
  (
    error: Record<string, unknown>,
    options: HandleErrorOptions
  ): HandleErrorResult
}

/**
 * Handle the request error.
 *
 * @param error Error.
 */
export interface HandleRequestErrorFunction {
  (error: Record<string, unknown>, options: HandleErrorOptions): never
}
