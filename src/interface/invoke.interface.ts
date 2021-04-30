import { FetchOptions, ProcessResponseResult } from '@leaf-x/fetch'
import { TriggerEvent } from './event.interface'
import { ResponseResult } from './response.interface'

/**
 * Invoke options.
 */
export interface InvokeOptions {
  event: TriggerEvent

  /**
   * Service name.
   */
  serviceName: string

  /**
   * Function name.
   */
  functionName: string

  /**
   * Whether to invoke asynchronously or not.
   */
  async?: boolean
}

/**
 * Execution invoke options.
 */
export interface ExecInvokeOptions {
  options: FetchOptions

  /**
   * The URL address to invoke.
   */
  url: string
}

/**
 * Execution invoke.
 *
 * @param retryNumber   Number of retries.
 * @param options       ExecInvokeOptions
 * @return ProcessResponseResult
 */
export interface ExecInvoke {
  (
    retryNumber: number,
    options: ExecInvokeOptions
  ): Promise<ProcessResponseResult>
}

/**
 * Initialize retry invoke.
 *
 * @param retryNumber   Number of retries.
 * @param options       ExecInvokeOptions
 * @return RetryInvoke
 */
export interface InitRetryInvoke {
  (retryNumber: number, options: ExecInvokeOptions): RetryInvoke
}

/**
 * Retry invoke.
 *
 * @param error Error.
 * @return Promise<ProcessResponseResult>
 */
export interface RetryInvoke {
  (error: Record<string, unknown>): Promise<ProcessResponseResult>
}

/**
 * Initialize the invoke options.
 */
export interface InitInvokeOptions {
  /**
   * Ali cloud account ID.
   */
  accountId: string

  /**
   * Ali cloud access ID.
   */
  accessId: string

  /**
   * Ali cloud access key.
   */
  accessSecretKey: string

  /**
   * Serverless qualifier.
   */
  qualifier: string

  /**
   * Serverless host.
   */
  host: string

  /**
   * Timeout time.
   */
  timeout: number

  /**
   * Serverless host.
   */
  endpoint: string

  /**
   * Serverless API version.
   */
  version: string
}

/**
 * Invoke.
 *
 * @param options InvokeOptions
 * @return Promise<ResponseResult>
 */
export interface Invoke {
  (options: InvokeOptions): Promise<ResponseResult>
}

/**
 * Initialization invoke.
 *
 * @param InitInvokeOptions
 * @return Invoke
 */
export interface InitInvoke {
  (config: InitInvokeOptions): Invoke
}

/**
 * Invoke the error options.
 */
export interface InvokeErrorOptions {
  /**
   * Service name.
   */
  serviceName: string

  /**
   * Function name.
   */
  functionName: string

  /**
   * Running environment.
   */
  env: string
}

/**
 * Initialization invoke error.
 *
 * @param options InvokeErrorOptions
 * @return InvokeError
 */
export interface InitInvokeError {
  (options: InvokeErrorOptions): InvokeError
}

/**
 * Invoke error.
 *
 * @param error Error.
 * @return never
 */
export interface InvokeError {
  (error: Record<string, unknown>): never
}
