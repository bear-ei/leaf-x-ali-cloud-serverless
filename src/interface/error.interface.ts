/**
 * Handle the error options.
 */
export interface HandleErrorOptions {
  /**
   * Service name.
   */
  serviceName: string;

  /**
   * Function name.
   */
  functionName: string;

  /**
   * Current runtime environment.
   */
  env: string;

  /**
   * Request ID.
   */
  requestId?: string;
}

/**
 * Handle the error result.
 *
 * @extends HandleErrorOptions
 */
export interface HandleErrorResult extends HandleErrorOptions {
  /**
   * Error response status code.
   */
  status: number;

  /**
   * Error business status code.
   */
  code: number;

  /**
   * Error message.
   */
  message: string;

  /**
   * Error details.
   */
  details?: unknown;

  /**
   * The function invoke chain where the error occurred.
   */
  apis?: HandleErrorOptions[];
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
  ): HandleErrorResult;
}

/**
 * Initialize the handle serverless error.
 *
 * @param options HandleErrorOptions
 * @return HandleError
 */
export interface InitHandleServerlessError {
  (options: HandleErrorOptions): HandleServerError;
}

/**
 * Handle serverless error.
 *
 * @param error Error.
 * @return never
 */
export interface HandleServerError {
  (error: Record<string, unknown>): never;
}
