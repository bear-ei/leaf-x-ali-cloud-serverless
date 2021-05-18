/**
 * Handle the wrong options.
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
   * Runtime environment.
   */
  env: string;

  /**
   * Current request ID.
   */
  requestId?: string;
}

/**
 * Handle error results.
 */
export interface HandleErrorResult extends HandleErrorOptions {
  /**
   * Response status code.
   */
  status: number;

  /**
   * Error code.
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
   * An error occurred in the API call chain.
   */
  apis?: HandleErrorOptions[];
}

/**
 * Handle error.
 *
 * @param error Record<string, unknown>
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
 * Initialize to handle serverless error.
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
 * @param error Record<string, unknown>
 * @return void
 */
export interface HandleServerlessError {
  (error: Record<string, unknown>): void;
}
