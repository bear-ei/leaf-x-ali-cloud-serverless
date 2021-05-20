import {FetchOptions, HandleResponseResult} from '@leaf-x/fetch';
import {TriggerEvent} from './event.interface';
import {InitRequestOptions} from './request.interface';
import {ResponseResult} from './response.interface';
import {AliCloudOptions} from './serverless.interface';

/**
 * Invoke the serverless options.
 */
export interface InvokeOptions {
  /**
   * Trigger event.
   */
  event: TriggerEvent;

  /**
   * Service name.
   */
  serviceName: string;

  /**
   * Function name.
   */
  functionName: string;

  /**
   * Whether to invoke serverless asynchronously.
   */
  async?: boolean;
}

/**
 * Initialize the execution to invoke serverless.
 *
 * @param options InitRequestOptions
 * @return ExecInvoke
 */
export interface InitExecInvoke {
  (options: InitRequestOptions): ExecInvoke;
}

/**
 * Execute the invoke serverless options.
 */
export interface ExecInvokeOptions {
  /**
   * Fetch options.
   */
  options: FetchOptions & {
    /**
     * Whether the request is asynchronous or not.
     */
    async?: boolean;
  };

  /**
   * Request URL.
   */
  url: string;
}

/**
 * Retry the invoke serverless options.
 */
export interface RetryOptions {
  /**
   * Number of retries.
   */
  retryNumber: number;
}

/**
 * Execute invoke serverless.
 *
 * @param retry RetryOptions
 * @param options ExecInvokeOptions
 * @return Promise<HandleResponseResult>
 */
export interface ExecInvoke {
  (
    retry: RetryOptions,
    options: ExecInvokeOptions
  ): Promise<HandleResponseResult>;
}

/**
 * Initialize the retry invoke serverless options.
 *
 * @extends RetryOptions
 */
export interface InitRetryInvokeOptions extends RetryOptions {
  /**
   * Initialize request options.
   */
  initRequestOptions: InitRequestOptions;
}

/**
 * Initialize the retry invoke serverless.
 *
 * @param retry InitRetryInvokeOptions
 * @param options ExecInvokeOptions
 * @return RetryInvoke
 */
export interface InitRetryInvoke {
  (retry: InitRetryInvokeOptions, options: ExecInvokeOptions): RetryInvoke;
}

/**
 * Retry the invoke serverless.
 *
 * @param error Error.
 * @return Promise<HandleResponseResult>
 */
export interface RetryInvoke {
  (error: Record<string, unknown>): Promise<HandleResponseResult>;
}

/**
 * Initialize invoke serverless options.
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
   * Timeout time.
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
 * Invoke serverless.
 *
 * @param options InvokeOptions
 * @return Promise<ResponseResult>
 */
export interface Invoke {
  (options: InvokeOptions): Promise<ResponseResult>;
}

/**
 * Initialize the invoke to serverless.
 *
 * @param options InitInvokeOptions
 * @return Invoke
 */
export interface InitInvoke {
  (options: InitInvokeOptions): Invoke;
}

/**
 * Handle the invoke serverless error options.
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
   * Invoke the serverless runtime environment.
   */
  env: string;
}

/**
 * Initialize to handle serverless invoke errors.
 *
 * @param options HandleInvokeErrorOptions
 * @return HandleInvokeError
 */
export interface InitHandleInvokeError {
  (options: HandleInvokeErrorOptions): HandleInvokeError;
}

/**
 * Handle invoke serverless errors.
 *
 * @param error Error.
 * @return never
 */
export interface HandleInvokeError {
  (error: Record<string, unknown>): never;
}
