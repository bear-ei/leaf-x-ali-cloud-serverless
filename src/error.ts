/**
 * Handle error options.
 */
export interface HandleErrorOptions {
  /**
   * Name of the service where the error occurred.
   */
  serviceName: string;

  /**
   * Name of the function where the error occurred.
   */
  functionName: string;

  /**
   * The deployment environment where the error occurred.
   */
  env: string;

  /**
   * The request ID of the error that occurred.
   */
  requestId?: string;
}

/**
 * Handle error.
 *
 * @param error Error.
 * @param options Handle error options.
 */
export const handleError = (
  error: unknown,
  {serviceName, functionName, requestId, env}: HandleErrorOptions
) => {
  const relError = error as Record<string, unknown>;
  const status = (relError.status ?? 500) as number;
  const code =
    relError.code && typeof relError.code === 'number' ? relError.code : status;

  const err = (
    relError.status && relError.code ? relError : {details: relError}
  ) as Record<string, unknown> & {details?: Record<string, unknown>};

  const currentApis = [{serviceName, functionName, requestId, env}];
  const message = (relError.message ??
    `${serviceName} ${functionName} invoke failed.`) as string;

  const apis =
    err.apis && Array.isArray(err.apis)
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

/**
 * Handle serverless error.
 *
 * @param error Error.
 * @param options Handle error options.
 */
const handleServerlessError = (error: unknown, options: HandleErrorOptions) =>
  throwError('Invalid invoke.', handleError(error, options));

/**
 * Initialize to handle serverless errors.
 *
 * @param options Handle error options.
 */
export const initHandleServerlessError =
  (options: HandleErrorOptions) => (error: unknown) =>
    handleServerlessError(error, options);

/**
 * Throw error.
 *
 * @param message Error message.
 * @param options Error message options.
 */
export const throwError = (message: string, options: unknown) => {
  throw Object.assign(new Error(message), options);
};
