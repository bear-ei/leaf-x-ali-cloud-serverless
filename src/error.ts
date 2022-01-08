/**
 * Handle the error options.
 */
export interface HandleErrorOptions {
  /**
   * The name of the requested service.
   */
  serviceName: string;

  /**
   * The name of the requested function.
   */
  functionName: string;

  /**
   * The requested deployment environment.
   */
  env: string;

  /**
   * Request ID.
   */
  requestId?: string;
}
/**
 * Handle errors.
 *
 * @param error Error.
 * @param options Handle the error options.
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
 * Handle serverless errors.
 *
 * @param error Error.
 * @param options Handle the error options.
 */
const handleServerlessError = (error: unknown, options: HandleErrorOptions) => {
  throw Object.assign(
    new Error('Invalid invoke.'),
    handleError(error, options)
  );
};

/**
 * Initialize the function that handles serverless errors.
 *
 * @param options Handle the error options.
 */
export const initHandleServerlessError =
  (options: HandleErrorOptions) => (error: unknown) =>
    handleServerlessError(error, options);
