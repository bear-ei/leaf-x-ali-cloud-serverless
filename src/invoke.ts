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
 * @param execInvokeOptions Execute the invoke function options.
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
  const retryInvoke = initRetryInvoke(
    {initRequestOptions, retryNumber},
    {url, options}
  );

  return request(url, options).catch(retryInvoke);
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
 * @param execInvokeOptions Execute the invoke function options.
 * @param initRetryInvokeOptions Initialize options for retrying function invoke.
 */
const retryInvoke = (
  error: unknown,
  {url, options}: ExecInvokeOptions,
  {retryNumber, initRequestOptions}: InitRetryInvokeOptions
) => {
  if (retryNumber > 0) {
    retryNumber--;

    const execInvoke = initExecInvoke(initRequestOptions);

    return execInvoke(retryNumber, {url, options});
  }

  throw error;
};

/**
 * Initialize the function to be invoke by the retry function.
 *
 * @param initRetryInvokeOptions Initialize options for retrying function invoke.
 * @param execInvokeOptions Execute the invoke function options.
 */
const initRetryInvoke =
  (
    initRetryInvokeOptions: InitRetryInvokeOptions,
    execInvokeOptions: ExecInvokeOptions
  ) =>
  (error: unknown) =>
    retryInvoke(error, execInvokeOptions, initRetryInvokeOptions);

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
 * @param invokeOptions Options for invoke the function.
 * @param initInvokeOptions Initialize the options for invoke the function.
 */
const invoke = (
  {serviceName, functionName, async = false, event}: InvokeOptions,
  {qualifier, endpoint, version, timeout, ...args}: InitInvokeOptions
) => {
  const path = `/services/${serviceName}.${qualifier}/functions/${functionName}/invocations`;
  const url = `${endpoint}/${version}${path}`;
  const body = JSON.stringify(handleTriggerEvent(event.type, event.data));
  const execInvoke = initExecInvoke(args);
  const handleInvokeError = initHandleInvokeError({
    serviceName,
    functionName,
    env: qualifier,
  });

  return execInvoke(/** Number of retries */ 3, {
    url,
    options: {method: 'POST', body, async, timeout},
  })
    .catch(handleInvokeError)
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
