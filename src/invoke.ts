import {FetchOptions} from '@leaf-x/fetch';
import {initHandleServerlessError} from './error';
import {
  EventTypeString,
  HandleGatewayEventOptions,
  handleTriggerEvent,
} from './event';
import {initRequest, InitRequestOptions} from './request';
import {handleResponse} from './response';
import {AliCloudOptions} from './serverless';

/**
 * Initialize options for retrying function invoke.
 */
export interface InitRetryInvokeOptions {
  /**
   * Options for initializing the request function.
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
   * Fetch options.
   */
  options: FetchOptions & {
    /**
     * Whether to execute asynchronous requests.
     */
    async?: boolean;
  };

  /**
   * Request URL.
   */
  url: string;
}

/**
 * Handle function request error options.
 */
export interface HandleInvokeErrorOptions {
  /**
   * Service name.
   */
  serviceName: string;

  /**
   * Function name.
   */
  functionName: string;

  /**
   * Invoke function deployment environment.
   */
  env: string;
}

/**
 * Initialize the options for invoke the function.
 */
export interface InitInvokeOptions extends AliCloudOptions {
  /**
   * The qualifier of the function to invoke.
   */
  qualifier: string;

  /**
   * The address of the host where the function is invoke.
   */
  host: string;

  /**
   * The timeout for invoke the function.
   */
  timeout: number;

  /**
   * The endpoint of the invoke to the function.
   */
  endpoint: string;

  /**
   * Invoke the API version of this function.
   */
  version: string;
}

/**
 * Options for invoke the function.
 */
export interface InvokeOptions {
  /**
   * Invoke events.
   */
  event: {
    /**
     * Event type string.
     */
    type: EventTypeString;

    /**
     * Options for handle API gateway trigger event.
     */
    data: HandleGatewayEventOptions;
  };

  /**
   * Service name.
   */
  serviceName: string;

  /**
   * Function name.
   */
  functionName: string;

  /**
   * Whether to execute asynchronous requests. default is false.
   */
  async?: boolean;
}

/**
 * Execute function invoke.
 *
 * @param retryNumber Number of retries.
 * @param options Execute the invoke function options.
 * @param initRequestOptions Options for initializing the request function.
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
 * Initializes the function to execute the function invoke.
 *
 * @param initRequestOptions Options for initializing the request function.
 */
const initExecInvoke =
  (initRequestOptions: InitRequestOptions) =>
  (retryNumber: number, options: ExecInvokeOptions) =>
    execInvoke(retryNumber, options, initRequestOptions);

/**
 * Retry function invoke.
 *
 * @param error Error.
 * @param options Execute the invoke function options.
 * @param initRetryInvokeOptions Initialize options for retrying function invoke.
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
 * Initialize the function to be invoke by the retry function.
 *
 * @param options Execute the invoke function options.
 * @param initRetryInvokeOptions Initialize options for retrying function invoke.
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
 * @param options Handle function request error options.
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
 * Initialize the function that handles function invoke errors.
 *
 * @param options Handle function request error options.
 */
const initHandleInvokeError =
  (options: HandleInvokeErrorOptions) => (error: unknown) =>
    handleInvokeError(error, options);

/**
 * Function invoke.
 *
 * @param options Options for invoke the function.
 * @param initInvokeOptions Initialize the options for invoke the function.
 */
const invoke = (
  {serviceName, functionName, async = false, event}: InvokeOptions,
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

  return invokeFun(/** Number of retries */ 3, {
    url,
    options: {method: 'POST', body, async, timeout},
  })
    .catch(invokeError)
    .then(response => handleResponse(event.type, response));
};

/**
 * Initializes the function invoke by the function.
 *
 * @param initInvokeOptions Initialize the options for invoke the function.
 */
export const initInvoke =
  (initInvokeOptions: InitInvokeOptions) => (options: InvokeOptions) =>
    invoke(options, initInvokeOptions);
