import { RequestConfig, RequestOptions, RequestResult } from './request'
import { EventOptions } from './util/eventToBuffer'

/**
 * Invoke function options.
 */
export interface InvokeOptions {
  /**
   * Invoke the event.
   */
  event: EventOptions

  /**
   * If or not the request is asynchronous, default value false.
   */
  async?: boolean
}

/**
 * Executes the invoke function options.
 */
export interface ExecInvokeOptions {
  /**
   * Request configuration.
   */
  config: RequestConfig

  /**
   * Request options.
   */
  options: RequestOptions
}

/**
 * Executes the invoke function.
 *
 * @param retryNumber Retry times.
 */
export interface ExecInvokeFunction {
  (retryNumber: number, options: ExecInvokeOptions): Promise<RequestResult>
}

/**
 * Retry the invoke.
 *
 * @param retryNumber   Retry times.
 * @param error         Error.
 */
export interface RetryInvokeFunction {
  (retryNumber: number, error: Record<string, unknown>):
    | Promise<RequestResult>
    | never
}

/**
 * Invoke function configuration.
 */
export interface InvokeConfig extends RequestConfig {
  /**
   * Invoke the endpoint.
   */
  endpoint: string

  /**
   * Function to calculate api version.
   */
  version: string
}

/**
 * Invoke function results.
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
   * Response header.
   */
  headers: Record<string, string>
}

/**
 * invoke function.
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
 * Initialize the invoke function..
 */
export interface InitInvokeFunction {
  (config: InvokeConfig): InvokeFunction
}
