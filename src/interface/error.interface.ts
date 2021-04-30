/**
 * Process the error options.
 */
export interface ProcessErrorOptions {
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
 * @extends ProcessErrorOptions
 */
export interface ProcessErrorResult extends ProcessErrorOptions {
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
   * Error details.
   */
  details?: unknown
  apis?: ProcessErrorOptions[]
}

/**
 * Process error.
 *
 * @param error     Error.
 * @param options   ProcessErrorOptions
 * @return ProcessErrorResult
 */
export interface ProcessError {
  (
    error: Record<string, unknown>,
    options: ProcessErrorOptions
  ): ProcessErrorResult
}

/**
 * Initialize to process serverless errors.
 *
 * @param options ProcessErrorOptions
 * @return ProcessServerlessError
 */
export interface InitProcessServerlessError {
  (options: ProcessErrorOptions): ProcessServerlessError
}

/**
 * Process serverless errors.
 *
 * @param error Error.
 * @return never
 */
export interface ProcessServerlessError {
  (error: Record<string, unknown>): never
}
