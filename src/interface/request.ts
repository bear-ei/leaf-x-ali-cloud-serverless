import { InvokeOptions } from './invoke'

/**
 * Request configuration.
 */
export interface RequestConfig {
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
   * Function version alias.
   */
  qualifier: string
}

/**
 *  Request options.
 */
export interface RequestOptions extends InvokeOptions {
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
 * Request results.
 */
export interface RequestResult {
  /**
   * Response status code.
   */
  status: number

  /**
   * Response data.
   */
  data: unknown

  /**
   * Response header.
   */
  headers: Record<string, string>

  [key: string]: unknown
}

/**
 * Request.
 */
export interface RequestFunction {
  (config: RequestConfig, options: RequestOptions): Promise<RequestResult>
}
