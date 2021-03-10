/**
 * Handle error options.
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
  requestId?: string

  /**
   * Running environment.
   */
  env: string
}

/**
 * Handle error results.
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
  apis?: HandleErrorOptions[]

  /**
   * Error details.
   */
  details?: unknown
}

/**
 * Handle response error options.
 */
export interface HandleRequestErrorOptions {
  /**
   * Service name.
   */
  serviceName: string

  /**
   * Function name.
   */
  functionName: string

  /**
   * Function version alias.
   */
  qualifier: string
}

/**
 * Handle error function.
 */
export interface HandleErrorFunction {
  (
    options: HandleErrorOptions,
    error: Record<string, unknown>
  ): HandleErrorResult
}
