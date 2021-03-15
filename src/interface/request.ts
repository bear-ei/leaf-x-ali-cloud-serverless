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
   * AliCloud account id.
   */
  accountId: string

  /**
   * AliCloud access id.
   */
  accessId: string

  /**
   * AliCloud access key.
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
 * Execute the request.
 */
export interface ExecRequestFunction {
  (
    config: ExecRequestConfig,
    options: ExecRequestOptions
  ): Promise<ExecRequestResult>
}
