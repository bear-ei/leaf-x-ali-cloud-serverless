import {FetchOptions, HandleResponseResult} from '@leaf-x/fetch';
import {initHandleServerlessError} from './error';
import {handleTriggerEvent, TriggerEvent} from './event';
import {initRequest, InitRequestOptions} from './request';
import {handleResponse, ResponseResult} from './response';
import {AliCloudOptions} from './serverless';

/**
 * Initialize the options to retry invoke to serverless.
 */
export interface InitRetryInvokeOptions {
  /**
   * Options for initialize request.
   */
  initRequestOptions: InitRequestOptions;

  /**
   * Number of retries.
   */
  retryNumber: number;
}

/**
 * Initialize the execution of the function that invoke serverless.
 *
 * @param options InitRequestOptions
 * @return ExecInvoke
 */
export interface InitExecInvoke {
  (options: InitRequestOptions): ExecInvoke;
}

/**
 * Execute the options to invoke serverless.
 */
export interface ExecInvokeOptions {
  /**
   * Options for the Fetch API.
   */
  options: FetchOptions & {
    /**
     * Whether the request is asynchronous or not.
     */
    async?: boolean;
  };

  /**
   * URL of the request.
   */
  url: string;
}

/**
 * Execute the invoke to serverless.
 *
 * @param retryNumber Number of retries.
 * @param options ExecInvokeOptions
 * @return Promise<HandleResponseResult>
 */
export interface ExecInvoke {
  (
    retryNumber: number,
    options: ExecInvokeOptions
  ): Promise<HandleResponseResult>;
}

/**
 * Initialize and retry the function that invoke serverless.
 *
 * @param initRetryInvoke InitRetryInvokeOptions.
 * @param options ExecInvokeOptions
 * @return RetryInvoke
 */
export interface InitRetryInvoke {
  (
    initRetryInvoke: InitRetryInvokeOptions,
    options: ExecInvokeOptions
  ): RetryInvoke;
}

/**
 * Retry the invoke to serverless.
 *
 * @param error Error.
 * @return Promise<HandleResponseResult>
 */
export interface RetryInvoke {
  (error: Record<string, unknown>): Promise<HandleResponseResult>;
}

/**
 * Options to handle invoke serverless error .
 */
export interface HandleInvokeErrorOptions {
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
}

/**
 * Initialize the function to handle invoke error.
 *
 * @param options HandleInvokeErrorOptions
 * @return HandleInvokeError
 */
export interface InitHandleInvokeError {
  (options: HandleInvokeErrorOptions): HandleInvokeError;
}

/**
 * Handle invoke serverless error.
 *
 * @param error Error.
 * @return never
 */
export interface HandleInvokeError {
  (error: Record<string, unknown>): never;
}

/**
 * Initialize the options to invoke serverless.
 *
 * @extends AliCloudOptions
 */
export interface InitInvokeOptions extends AliCloudOptions {
  /**
   * Invoke serverless qualifier.
   */
  qualifier: string;

  /**
   * Invoke serverless host.
   */
  host: string;

  /**
   * Set the request timeout in milliseconds.
   */
  timeout: number;

  /**
   * Invoke the serverless endpoint.
   */
  endpoint: string;

  /**
   * Invoke the serverless API version.
   */
  version: string;
}

/**
 * Initialize the function that invoke serverless.
 *
 * @param options InitInvokeOptions
 * @return Invoke
 */
export interface InitInvoke {
  (options: InitInvokeOptions): Invoke;
}

/**
 * The options to invoke serverless.
 */
export interface InvokeOptions {
  /**
   * Serverless trigger event.
   */
  event: TriggerEvent;

  /**
   * Current request serverless service name.
   */
  serviceName: string;

  /**
   * Current request serverless function name.
   */
  functionName: string;

  /**
   * Whether to invoke serverless asynchronously.
   */
  async?: boolean;
}

/**
 * Invoke serverless.
 *
 * @param options InvokeOptions
 * @return Promise<ResponseResult>
 */
export interface Invoke {
  (options: InvokeOptions): Promise<ResponseResult>;
}

const initExecInvoke: InitExecInvoke =
  initRequestOptions =>
  (retryNumber, {url, options}) => {
    const retryInvoke = initRetryInvoke(
      {initRequestOptions, retryNumber},
      {url, options}
    );

    return initRequest(initRequestOptions)(url, options).catch(retryInvoke);
  };

const initRetryInvoke: InitRetryInvoke =
  ({retryNumber, initRequestOptions}, {url, options}) =>
  error => {
    if (retryNumber > 0) {
      retryNumber--;

      return initExecInvoke(initRequestOptions)(retryNumber, {
        url,
        options,
      });
    }

    throw error;
  };

const initHandleInvokeError: InitHandleInvokeError = options => error => {
  const headers = (error.headers ?? {}) as Record<string, unknown>;
  const requestId = headers['x-fc-request-id'] as string;

  return initHandleServerlessError({...options, requestId})(error);
};

export const initInvoke: InitInvoke =
  ({qualifier, endpoint, version, timeout, ...args}) =>
  async ({serviceName, functionName, async = false, event}) => {
    const path = `/services/${serviceName}.${qualifier}/functions/${functionName}/invocations`;
    const url = `${endpoint}/${version}${path}`;
    const body = JSON.stringify(handleTriggerEvent(event));
    const handleInvokeError = initHandleInvokeError({
      serviceName,
      functionName,
      env: qualifier,
    });

    return initExecInvoke(args)(/** Number of retries */ 3, {
      url,
      options: {method: 'POST', body, async, timeout},
    })
      .catch(handleInvokeError)
      .then(response => handleResponse({type: event.type, response}));
  };
