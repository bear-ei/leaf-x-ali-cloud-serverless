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
  requestId: string;
}

/**
 * Handle invoke function error options.
 */
export interface HandleInvokeErrorOptions {
  /**
   * Name of the service where the error occurred.
   */
  serviceName: HandleErrorOptions['serviceName'];

  /**
   * Name of the function where the error occurred.
   */
  functionName: HandleErrorOptions['functionName'];

  /**
   * The deployment environment where the error occurred.
   */
  env: HandleErrorOptions['env'];
}

/**
 * Handle the error result.
 */
export interface HandleErrorResult {
  /**
   * Response status code.
   */
  status: number;

  /**
   * Business error Code.
   */
  code: number;

  /**
   * Service name.
   */
  serviceName: string;

  /**
   * Function name.
   */
  functionName: string;

  /**
   * Request ID.
   */
  requestId: string;

  /**
   * Error message.
   */
  message: string;

  /**
   * Deployment environment
   */
  env: string;

  /**
   * Associated API information.
   */
  apis: {
    serviceName: string;
    functionName: string;
    requestId: string;
    env: string;
  }[];

  /**
   * Error details.
   */
  details?: Record<string, unknown>;
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
): HandleErrorResult => {
  const relError = error as Record<string, unknown>;
  const status = (relError.status ?? 500) as number;
  const code =
    relError.code && typeof relError.code === 'number' ? relError.code : status;

  const err = relError.status && relError.code ? relError : {details: relError};
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
 * Handle function invoke errors.
 *
 * @param error Error.
 * @param options Handle invoke function error options.
 */
const handleInvokeError = (
  error: unknown,
  options: HandleInvokeErrorOptions
) => {
  const relError = error as Record<string, unknown>;
  const headers = (relError.headers ?? {}) as Record<string, string>;
  const requestId = headers['x-fc-request-id'];
  const serverlessError = initHandleServerlessError({
    ...options,
    requestId,
  });

  return serverlessError(error);
};

/**
 * Initialize to handle function invoke errors.
 *
 * @param options Handle invoke function error options.
 */
export const initHandleInvokeError =
  (options: HandleInvokeErrorOptions) => (error: unknown) =>
    handleInvokeError(error, options);

/**
 * Handle serverless error.
 *
 * @param error Error.
 * @param options Handle error options.
 */
const handleServerlessError = (error: unknown, options: HandleErrorOptions) => {
  throw handleError(error, options);
};

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
 * @param options Error message options.
 * @param message Error message.
 */
export const throwError = (options?: unknown, message?: string) => {
  throw Object.assign(new Error(message), options);
};
