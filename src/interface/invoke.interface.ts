import { FetchOptions, HandleResponseResult } from '@leaf-x/fetch'
import { TriggerEvent } from './event.interface'
import { ResponseResult } from './response.interface'

/**
 * Invoke options.
 */
export interface InvokeOptions {
  /**
   * Service name.
   */
  serviceName: string

  /**
   * Function name.
   */
  functionName: string

  /**
   * Trigger events.
   */
  event: TriggerEvent

  /**
   * Whether to invoke asynchronously or not.
   */
  async?: boolean
}

/**
 * Execution invoke options.
 */
export interface ExecInvokeOptions {
  /**
   * The URL address to invoke.
   */
  url: string

  /**
   * Fetch options.
   */
  options: FetchOptions
}

/**
 * Execution invoke.
 *
 * @param retryNumber Number of retries.
 */
export interface ExecInvoke {
  (
    retryNumber: number,
    options: ExecInvokeOptions
  ): Promise<HandleResponseResult>
}

/**
 * Retry invoke.
 *
 * @param retryNumber Number of retries.
 */
export interface RetryInvoke {
  (retryNumber: number, options: ExecInvokeOptions): (
    error: Record<string, unknown>
  ) => Promise<HandleResponseResult> | never
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
 */
export interface Invoke {
  (options: InvokeOptions): Promise<ResponseResult>
}

/**
 * Initialization invoke.
 */
export interface InitInvoke {
  (config: InitInvokeOptions): Invoke
}

/**
 * Invoke the wrong option.
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
 * Invoke error.
 *
 * @param error Error.
 */
export interface InvokeError {
  (options: InvokeErrorOptions): (error: Record<string, unknown>) => never
}
