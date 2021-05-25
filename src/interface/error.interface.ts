/**
 * Options for handle error.
 */
export interface HandleErrorOptions {
  /**
   * Current request serverless service name.
   */
  serviceName: string;

  /**
   * Current request serverless function name.
   */
  functionName: string;

  /**
   * Current serverless runtime environment.
   */
  env: string;

  /**
   * Current request ID.
   */
  requestId?: string;
}

/**
 * The result of the handle error.
 *
 * @extends HandleErrorOptions
 */
export interface HandleErrorResult extends HandleErrorOptions {
  /**
   * Serverless response status code.
   */
  status: number;

  /**
   * Customized business error codes.
   */
  code: number;

  /**
   * Error message.
   */
  message: string;

  /**
   * Error message details.
   */
  details?: unknown;

  /**
   * An error occurred in the API call chain.
   */
  apis?: HandleErrorOptions[];
}

/**
 * Handle error.
 *
 * @param error Error.
 * @param options HandleErrorOptions
 * @return HandleErrorResult
 */
export interface HandleError {
  (
    error: Record<string, unknown>,
    options: HandleErrorOptions
  ): HandleErrorResult;
}

/**
 * Initialize the function that handle serverless error.
 *
 * @param options HandleErrorOptions
 * @return HandleServerError
 */
export interface InitHandleServerlessError {
  (options: HandleErrorOptions): HandleServerlessError;
}

/**
 * Handle serverless error.
 *
 * @param error Error.
 * @return never
 */
export interface HandleServerlessError {
  (error: Record<string, unknown>): never;
}
