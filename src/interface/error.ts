/**
 * Handle the error options.
 */
export interface HandleErrorOptions {
  /**
   * The name of the currently invoked service.
   */
  serviceName: string

  /**
   * The name of the currently invoked function.
   */
  functionName: string

  /**
   * The request id of the current invoked.
   */
  requestId: string

  /**
   * The request environment of the current invoked.
   */
  env: string
}

/**
 * The result of a handle error.
 */
export interface HandleErrorResult extends HandleErrorOptions {
  /**
   * The status code of the error response.
   */
  status: number

  /**
   * The business code for the error response.
   */
  code: number

  /**
   * Error description message.
   */
  message: string

  /**
   * The chain of api invoked where the error occurred.
   */
  apis?: HandleErrorOptions[]

  /**
   * Details of the error.
   */
  details?: unknown
}

/**
 * Function to handle errors.
 */
export interface HandleErrorFunction {
  (
    error: Record<string, unknown>,
    options: HandleErrorOptions
  ): HandleErrorResult
}

/**
 * Function to handle request errors.
 */
export interface HandleRequestErrorFunction {
  (error: Record<string, unknown>, options: HandleErrorOptions): never
}
