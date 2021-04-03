import { HandleEventToBufferOptions } from './event'
import {
  ExecRequestConfig,
  ExecRequestOptions,
  ExecRequestResult
} from './request'

/**
 * The options to invoke the serverless function.
 */
export interface InvokeOptions {
  /**
   * Invoke the event of the serverless function.
   */
  event: HandleEventToBufferOptions

  /**
   * Whether to make asynchronous invoke.
   */
  async?: boolean
}

/**
 * The options to perform serverless invoke.
 */
export interface ExecInvokeOptions {
  /**
   * Execute the requested configuration.
   */
  config: ExecRequestConfig

  /**
   * The options to execute the request.
   */
  options: ExecRequestOptions
}

/**
 * Executes the function invoked by serverless.
 *
 * @param retryNumber The number of times to retry after a failed invoke.
 */
export interface ExecInvokeFunction {
  (retryNumber: number, options: ExecInvokeOptions): Promise<ExecRequestResult>
}

/**
 * Retries the invoked function.
 *
 * @param retryNumber The number of times to retry after a failed invoke.
 */
export interface RetryInvokeFunction {
  (retryNumber: number, error: Record<string, unknown>):
    | Promise<ExecRequestResult>
    | never
}

/**
 * Invoke the serverless configuration.
 */
export interface InvokeConfig extends ExecRequestConfig {
  /**
   * Endpoints for serverless.
   */
  endpoint: string

  /**
   * The api version of serverless.
   */
  version: string
}

/**
 * The result of invoke serverless.
 */
export interface InvokeResult {
  /**
   * Serverless response data.
   */
  data: unknown

  /**
   * Serverless response status.
   */
  status: number

  /**
   * Serverless response headers.
   */
  headers: Record<string, string>
}

/**
 * Invoke the functions of serverless.
 */
export interface InvokeFunction {
  (
    serviceName: string,
    functionName: string,
    options: InvokeOptions
  ): Promise<InvokeResult>
}

/**
 * Initialize the function that invoke serverless.
 */
export interface InitInvokeFunction {
  (config: InvokeConfig): InvokeFunction
}
