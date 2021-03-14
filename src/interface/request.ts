import { InvokeOptions } from './invoke'

/**
 * Execute request configuration.
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
   * Ali cloud access id.
   */
  accessId: string

  /**
   * Ali cloud access key.
   */
  accessSecretKey: string

  /**
   * Request timeout time in milliseconds.
   */
  timeout: number

  /**
   * Serverless version alias.
   */
  qualifier: string
}

/**
 *  Execute request options.
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
 * Execution request result.
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
 * Execute requests.
 */
export interface ExecRequestFunction {
  (
    config: ExecRequestConfig,
    options: ExecRequestOptions
  ): Promise<ExecRequestResult>
}
