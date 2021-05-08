import {FetchOptions, HandleResponseResult} from '@leaf-x/fetch';
import {TriggerEvent} from './event.interface';
import {ResponseResult} from './response.interface';

/**
 * Invoke options.
 */
export interface InvokeOptions {
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
   * Whether to perform asynchronous invoke.
   */
  async?: boolean;
}

/**
 * Execute invoke options.
 */
export interface ExecInvokeOptions {
  /**
   * Initialize the fetch options.
   */
  options: FetchOptions;

  /**
   * Invoke URL address.
   */
  url: string;
}

/**
 * Execute the invoke.
 *
 * @param retryNumber   The number of retries after failed invoke.
 * @param options       ExecInvokeOptions
 * @return HandleResponseResult
 */
export interface ExecInvoke {
  (
    retryNumber: number,
    options: ExecInvokeOptions
  ): Promise<HandleResponseResult>;
}

/**
 * Initialize the retry invoke.
 *
 * @param retryNumber   The number of retries after failed invoke.
 * @param options       ExecInvokeOptions
 * @return RetryInvoke
 */
export interface InitRetryInvoke {
  (retryNumber: number, options: ExecInvokeOptions): RetryInvoke;
}

/**
 * Retry the invoke.
 *
 * @param error Error.
 * @return Promise<HandleResponseResult>
 */
export interface RetryInvoke {
  (error: Record<string, unknown>): Promise<HandleResponseResult>;
}

/**
 * Initialize invoke options.
 */
export interface InitInvokeOptions {
  /**
   * Ali cloud account ID.
   */
  accountId: string;

  /**
   * Ali cloud access ID.
   */
  accessId: string;

  /**
   * Ali cloud access key.
   */
  accessSecretKey: string;

  /**
   * Serverless qualifier.
   */
  qualifier: string;

  /**
   * Serverless host.
   */
  host: string;

  /**
   * Invoke timeout time in milliseconds.
   */
  timeout: number;

  /**
   * Serverless endpoint.
   */
  endpoint: string;

  /**
   * Serverless API version.
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
 * Initialize invoke serverless.
 *
 * @param InitInvokeOptions
 * @return Invoke
 */
export interface InitInvoke {
  (config: InitInvokeOptions): Invoke;
}

/**
 * Invoke the error options.
 */
export interface InvokeErrorOptions {
  /**
   * Service name.
   */
  serviceName: string;

  /**
   * Function name.
   */
  functionName: string;

  /**
   * Current runtime environment.
   */
  env: string;
}

/**
 * Initialize invoke error.
 *
 * @param options InvokeErrorOptions
 * @return InvokeError
 */
export interface InitInvokeError {
  (options: InvokeErrorOptions): InvokeError;
}

/**
 * Invoke error.
 *
 * @param error Error.
 * @return never
 */
export interface InvokeError {
  (error: Record<string, unknown>): never;
}
