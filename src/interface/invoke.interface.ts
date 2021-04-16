import { HandleEventToBufferOptions } from './event.interface'
import {
  ExecRequestConfig,
  ExecRequestOptions,
  ExecRequestResult
} from './request.interface'

/**
 * Invoke the serverless options.
 */
export interface InvokeOptions {
  /**
   * Name of the service that invoke serverless.
   */
  serviceName: string

  /**
   * Name of the function to invoke serverless.
   */
  functionName: string

  /**
   * Options to handle serverless events to Buffer.
   */
  event: HandleEventToBufferOptions

  /**
   * Whether to make asynchronous invoke.
   */
  async?: boolean
}

/**
 * Execute the invoke serverless options.
 */
export interface ExecInvokeOptions {
  /**
   * Execute the configuration of serverless requests.
   */
  config: ExecRequestConfig

  /**
   * Options to execute serverless requests.
   */
  options: ExecRequestOptions
}

/**
 * Execute invoke serverless.
 *
 * @param retryNumber Number of retries after the invoke failed.
 */
export interface ExecInvokeFunction {
  (retryNumber: number, options: ExecInvokeOptions): Promise<ExecRequestResult>
}

/**
 * Retry invoke serverless.
 *
 * @param retryNumber   Number of retries after the invoke failed.
 * @param error         Error message.
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
   * Invoke serverless endpoints.
   */
  endpoint: string

  /**
   * Serverless api version.
   */
  version: string
}

/**
 * Result of Invoke serverless.
 */
export interface InvokeResult {
  /**
   * Data that serverless responds to.
   */
  data: unknown

  /**
   * Status code of the serverless response.
   */
  status: number

  /**
   * Serverless response headers.
   */
  headers: unknown
}

/**
 * Invoke serverless function.
 */
export interface InvokeFunction {
  (options: InvokeOptions): Promise<InvokeResult>
}

/**
 * Initialize the serverless function.
 */
export interface InitInvokeFunction {
  (config: InvokeConfig): InvokeFunction
}
