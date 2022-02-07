import {FetchOptions} from '@leaf-x/fetch';
import {HandleErrorOptions, initHandleServerlessError} from './error';
import {
  EventTypeString,
  HandleGatewayEventOptions,
  handleTriggerEvent,
} from './event';
import {initRequest, InitRequestOptions} from './request';
import {handleResponse} from './response';
import {AliCloudOptions} from './serverless';

/**
 * Initialize the options to retry invoke the function.
 */
export interface InitRetryInvokeOptions {
  /**
   * Initialize request options.
   */
  initRequestOptions: InitRequestOptions;

  /**
   * Number of retries.
   */
  retryNumber: number;
}

/**
 * Execute the invoke function options.
 */
export interface ExecInvokeOptions {
  /**
   * Fetch API options.
   */
  options: FetchOptions & {
    /**
     * Whether the current invoke is an asynchronous invoke.
     */
    isAsync?: boolean;
  };

  /**
   * Request URL.
   */
  url: string;
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
 * Initialize the invoke function options.
 */
export interface InitInvokeOptions extends AliCloudOptions {
  /**
   * Request service qualifier.
   */
  qualifier: string;

  /**
   * The host address of the invoke service.
   */
  host: string;

  /**
   * Request timeout time.
   */
  timeout: number;

  /**
   * The endpoint for invoke the service.
   */
  endpoint: string;

  /**
   * Serverless API version number.
   */
  version: string;
}

/**
 * Invoke function options.
 */
export interface InvokeOptions {
  /**
   * The event that invoke the function.
   */
  event: {
    /**
     * Trigger event type enumeration string.
     */
    type: EventTypeString;

    /**
     * Handle API gateway event options.
     */
    data: HandleGatewayEventOptions;
  };

  /**
   * Invoke the service name.
   */
  serviceName: string;

  /**
   * Invoke the function name.
   */
  functionName: string;

  /**
   * Whether the current invoke is an asynchronous invoke.
   */
  isAsync?: boolean;
}

/**
 * Execute the invoke function.
 *
 * @param retryNumber Number of retries.
 * @param options Execute the invoke function options.
 * @param initRequestOptions Initialize request options.
 */
const execInvoke = (
  retryNumber: number,
  {url, options}: ExecInvokeOptions,
  initRequestOptions: InitRequestOptions
): Promise<{
  data: unknown;
  options: FetchOptions;
  headers: Record<string, string>;
  status: number;
  statusText: string;
  url: string;
}> => {
  const request = initRequest(initRequestOptions);
  const retry = initRetryInvoke(
    {url, options},
    {initRequestOptions, retryNumber}
  );

  return request(url, options).catch(retry);
};

/**
 * Initializes the execution of the invoke function.
 *
 * @param initRequestOptions Initialize request options.
 */
const initExecInvoke =
  (initRequestOptions: InitRequestOptions) =>
  (retryNumber: number, options: ExecInvokeOptions) =>
    execInvoke(retryNumber, options, initRequestOptions);

/**
 * Retry the function invoke.
 *
 * @param error Error.
 * @param options Execute the invoke function options.
 * @param initRetryInvokeOptions Initialize the options to retry invoke the function.
 */
const retryInvoke = (
  error: unknown,
  {url, options}: ExecInvokeOptions,
  {retryNumber, initRequestOptions}: InitRetryInvokeOptions
) => {
  if (retryNumber > 0) {
    retryNumber--;

    const invokeFun = initExecInvoke(initRequestOptions);

    return invokeFun(retryNumber, {url, options});
  }

  throw error;
};

/**
 * Initialize the retry invoke function.
 *
 * @param options Execute the invoke function options.
 * @param initRetryInvokeOptions Initialize the options to retry invoke the function.
 */
const initRetryInvoke =
  (
    options: ExecInvokeOptions,
    initRetryInvokeOptions: InitRetryInvokeOptions
  ) =>
  (error: unknown) =>
    retryInvoke(error, options, initRetryInvokeOptions);

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
  const handleServerlessError = initHandleServerlessError({
    ...options,
    requestId,
  });

  return handleServerlessError(error);
};

/**
 * Initialize to handle function invoke errors.
 *
 * @param options Handle invoke function error options.
 */
const initHandleInvokeError =
  (options: HandleInvokeErrorOptions) => (error: unknown) =>
    handleInvokeError(error, options);

/**
 * Invoke functions.
 *
 * @param options Invoke function options.
 * @param initInvokeOptions Initialize the invoke function options.
 */
const invoke = (
  {serviceName, functionName, isAsync = false, event}: InvokeOptions,
  {qualifier, endpoint, version, timeout, ...args}: InitInvokeOptions
) => {
  const path = `/services/${serviceName}.${qualifier}/functions/${functionName}/invocations`;
  const url = `${endpoint}/${version}${path}`;
  const body = JSON.stringify(handleTriggerEvent(event.type, event.data));
  const invokeFun = initExecInvoke(args);
  const invokeError = initHandleInvokeError({
    serviceName,
    functionName,
    env: qualifier,
  });

  return invokeFun(/** Number of retries.*/ 3, {
    url,
    options: {method: 'POST', body, isAsync, timeout},
  })
    .catch(invokeError)
    .then(response => handleResponse(event.type, response));
};

/**
 * Initialize the invoke function.
 *
 * @param initInvokeOptions Initialize the invoke function options.
 */
export const initInvoke =
  (initInvokeOptions: InitInvokeOptions) => (options: InvokeOptions) =>
    invoke(options, initInvokeOptions);
