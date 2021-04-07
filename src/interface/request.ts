import { InvokeOptions } from './invoke'

/**
 * Execute the request configuration.
 */
export interface ExecRequestConfig {
  /**
   * Request host.
   */
  host: string

  /**
   * Ali cloud account id.
   */
  accountId: string

  /**
   * Ali cloud serverless access id.
   */
  accessId: string

  /**
   * Ali cloud access key.
   */
  accessSecretKey: string

  /**
   * Request timeout time, in milliseconds.
   */
  timeout: number

  /**
   * Serverless service alias.
   */
  qualifier: string
}

/**
 * Execute the request options.
 */
export interface ExecRequestOptions extends InvokeOptions {
  /**
   * The name of the serverless service.
   */
  serviceName: string

  /**
   * The name of the serverless function.
   */
  functionName: string

  /**
   * Serverless url address.
   */
  url: string
}

/**
 * Execute the request result.
 */
export interface ExecRequestResult {
  /**
   * Response status code.
   */
  status: number

  /**
   * Response data.
   */
  data: unknown

  /**
   * Response headers.
   */
  headers: Record<string, string>

  [key: string]: unknown
}

/**
 * Execute the request.
 */
export interface ExecRequestFunction {
  (
    options: ExecRequestOptions,
    config: ExecRequestConfig
  ): Promise<ExecRequestResult>
}
