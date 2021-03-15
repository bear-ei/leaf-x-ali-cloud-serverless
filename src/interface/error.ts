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
   * Request id.
   */
  requestId: string

  /**
   * Running environment.
   */
  env: string
}

/**
 * Handle the error result.
 */
export interface HandleErrorResult extends HandleErrorOptions {
  /**
   * Response status code.
   */
  status: number

  /**
   * Response error code.
   */
  code: number

  /**
   * Response error message.
   */
  message: string

  /**
   * Invoke chain information.
   */
  functions?: HandleErrorOptions[]

  /**
   * Error details.
   */
  details?: unknown
}

/**
 * Handle error.
 */
export interface HandleErrorFunction {
  (
    options: HandleErrorOptions,
    error: Record<string, unknown>
  ): HandleErrorResult
}

/**
 * Handle request error.
 */
export interface HandleRequestErrorFunction {
  (options: HandleErrorOptions, error: Record<string, unknown>): never
}
