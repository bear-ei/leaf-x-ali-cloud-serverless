import {FetchOptions, HandleResponseResult} from '@leaf-x/fetch';
import {TriggerEvent} from './event.interface';
import {InitRequestOptions} from './request.interface';
import {ResponseResult} from './response.interface';
import {AliCloudOptions} from './serverless.interface';

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
 * Retry the options to invoke serverless.
 */
export interface RetryOptions {
  /**
   * Number of retries.
   */
  retryNumber: number;
}

/**
 * Execute the invoke to serverless.
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
 * Initialize the options to retry invoke to serverless.
 *
 * @extends RetryOptions
 */
export interface InitRetryInvokeOptions extends RetryOptions {
  /**
   * Options for initialize request.
   */
  initRequestOptions: InitRequestOptions;
}

/**
 * Initialize and retry the function that invoke serverless.
 *
 * @param retry InitRetryInvokeOptions
 * @param options ExecInvokeOptions
 * @return RetryInvoke
 */
export interface InitRetryInvoke {
  (retry: InitRetryInvokeOptions, options: ExecInvokeOptions): RetryInvoke;
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
 * Invoke serverless.
 *
 * @param options InvokeOptions
 * @return Promise<ResponseResult>
 */
export interface Invoke {
  (options: InvokeOptions): Promise<ResponseResult>;
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
