import { HandleEventToBufferOptions } from './event'
import {
  ExecRequestConfig,
  ExecRequestOptions,
  ExecRequestResult
} from './request'

/**
 * Invoke the options.
 */
export interface InvokeOptions {
  /**
   * Invoke the event.
   */
  event: HandleEventToBufferOptions

  /**
   * Whether to make asynchronous invokes.
   */
  async?: boolean
}

/**
 * Execute the invoke options.
 */
export interface ExecInvokeOptions {
  /**
   * Request configuration.
   */
  config: ExecRequestConfig

  /**
   * Request options.
   */
  options: ExecRequestOptions
}

/**
 * Execute the invoke.
 *
 * @param retryNumber Number of retries.
 */
export interface ExecInvokeFunction {
  (retryNumber: number, options: ExecInvokeOptions): Promise<ExecRequestResult>
}

/**
 * Retry the invoke.
 *
 * @param retryNumber   Number of retries.
 * @param error         Error.
 */
export interface RetryInvokeFunction {
  (retryNumber: number, error: Record<string, unknown>):
    | Promise<ExecRequestResult>
    | never
}

/**
 * invoke the configuration.
 */
export interface InvokeConfig extends ExecRequestConfig {
  /**
   * Invoke the endpoint.
   */
  endpoint: string

  /**
   * Serverless api version.
   */
  version: string
}

/**
 * Invoke results.
 */
export interface InvokeResult {
  /**
   * Response data.
   */
  data: unknown

  /**
   * Response status code.
   */
  status: number

  /**
   * Response headers.
   */
  headers: Record<string, string>
}

/**
 * Invoke.
 *
 * @param serviceName   Service name.
 * @param functionName  Function name.
 */
export interface InvokeFunction {
  (
    serviceName: string,
    functionName: string,
    options: InvokeOptions
  ): Promise<InvokeResult>
}

/**
 * Initialization invoke.
 */
export interface InitInvokeFunction {
  (config: InvokeConfig): InvokeFunction
}
