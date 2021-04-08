import { HandleEventToBufferOptions } from './event'
import {
  ExecRequestConfig,
  ExecRequestOptions,
  ExecRequestResult
} from './request'

/**
 * Invoke the serverless options.
 */
export interface InvokeOptions {
  /**
   * The name of the serverless service.
   */
  serviceName: string

  /**
   * The name of the serverless function.
   */
  functionName: string

  /**
   * Handle the event to buffer options.
   */
  event: HandleEventToBufferOptions

  /**
   * Whether to invoke serverless asynchronously.
   */
  async?: boolean
}

/**
 * Execute the invoke to serverless options.
 */
export interface ExecInvokeOptions {
  /**
   * Execute the request configuration.
   */
  config: ExecRequestConfig

  /**
   * Execute the request options.
   */
  options: ExecRequestOptions
}

/**
 * Execute the invoke to serverless.
 *
 * @param retryNumber The number of retries to invoke.
 */
export interface ExecInvokeFunction {
  (retryNumber: number, options: ExecInvokeOptions): Promise<ExecRequestResult>
}

/**
 * Retry the invoke to serverless.
 *
 * @param retryNumber   The number of retries to invoke.
 * @param error         Error.
 */
export interface RetryInvokeFunction {
  (retryNumber: number, error: Record<string, unknown>):
    | Promise<ExecRequestResult>
    | never
}

/**
 * Invoke serverless configuration.
 */
export interface InvokeConfig extends ExecRequestConfig {
  /**
   * Invoke the endpoint.
   */
  endpoint: string

  /**
   * Invoke the serverless API version.
   */
  version: string
}

/**
 * Invoke serverless results.
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
 * Invoke serverless.
 */
export interface InvokeFunction {
  (options: InvokeOptions): Promise<InvokeResult>
}

/**
 * Initialize the invoke to serverless.
 */
export interface InitInvokeFunction {
  (config: InvokeConfig): InvokeFunction
}
