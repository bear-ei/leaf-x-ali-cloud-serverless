import { HandleEventToBufferOptions } from './event'
import {
  ExecRequestConfig,
  ExecRequestOptions,
  ExecRequestResult
} from './request'

/**
 * Invoke options.
 */
export interface InvokeOptions {
  /**
   * Invoke the event.
   */
  event: HandleEventToBufferOptions

  /**
   * If or not the request is asynchronous, default value false.
   */
  async?: boolean
}

/**
 * Executes the invoke options.
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
 * Executes the invoke.
 *
 * @param retryNumber Retry times.
 */
export interface ExecInvokeFunction {
  (retryNumber: number, options: ExecInvokeOptions): Promise<ExecRequestResult>
}

/**
 * Retry the invoke.
 *
 * @param retryNumber   Retry times.
 * @param error         Error.
 */
export interface RetryInvokeFunction {
  (retryNumber: number, error: Record<string, unknown>):
    | Promise<ExecRequestResult>
    | never
}

/**
 * Invoke configuration.
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
 * Invoke result.
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
 * Initialize the invoke.
 */
export interface InitInvokeFunction {
  (config: InvokeConfig): InvokeFunction
}
