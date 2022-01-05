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
 * Handle serverless error.
 *
 * @param error Error.
 * @return never
 */
export interface HandleServerlessError {
  (error: Record<string, unknown>): never;
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

export const handleError: HandleError = (
  error,
  {serviceName, functionName, requestId, env}
) => {
  const status = (error.status ?? 500) as number;
  const code =
    error.code && typeof error.code === 'number' ? error.code : status;

  const err = error.status && error.code ? error : {details: error};
  const currentApis = [{serviceName, functionName, requestId, env}];
  const message = (error.message ??
    `${serviceName} ${functionName} invoke failed.`) as string;

  const apis = Array.isArray(err.apis)
    ? currentApis.concat(err.apis)
    : currentApis;

  return {
    ...err,
    status,
    code,
    serviceName,
    functionName,
    requestId,
    message,
    env,
    apis,
  };
};

export const initHandleServerlessError: InitHandleServerlessError =
  options => error => {
    throw Object.assign(
      new Error('Invalid invoke.'),
      handleError(error, options)
    );
  };
