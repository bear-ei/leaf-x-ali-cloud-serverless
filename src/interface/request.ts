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
   * Ali cloud account ID.
   */
  accountId: string

  /**
   * Ali cloud access ID.
   */
  accessId: string

  /**
   *  Ali cloud access key.
   */
  accessSecretKey: string

  /**
   * Request timeout time, in milliseconds.
   */
  timeout: number

  /**
   * Serverless version alias.
   */
  qualifier: string
}

/**
 *  Execute the request options.
 */
export interface ExecRequestOptions extends InvokeOptions {
  /**
   * Service name.
   */
  serviceName: string

  /**
   * Function name.
   */
  functionName: string

  /**
   * Request url.
   */
  url: string
}

/**
 * Execute the request results.
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
