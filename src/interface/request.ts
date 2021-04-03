import { InvokeOptions } from './invoke'

/**
 * Execute the requested configuration.
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
   * Access key for ali cloud.
   */
  accessSecretKey: string

  /**
   * The timeout period for the request.
   */
  timeout: number

  /**
   * The requested serverless alias.
   */
  qualifier: string
}

/**
 * The options to execute the request.
 */
export interface ExecRequestOptions extends InvokeOptions {
  /**
   * The name of the requested serverless service.
   */
  serviceName: string

  /**
   * The name of the requested serverless function.
   */
  functionName: string

  /**
   * The requested serverless url address.
   */
  url: string
}

/**
 * The result of the execution request.
 */
export interface ExecRequestResult {
  /**
   * The status code of the response.
   */
  status: number

  /**
   * The response data.
   */
  data: unknown

  /**
   * Response headers.
   */
  headers: Record<string, string>

  [key: string]: unknown
}

/**
 * The function to execute the request.
 */
export interface ExecRequestFunction {
  (
    options: ExecRequestOptions,
    config: ExecRequestConfig
  ): Promise<ExecRequestResult>
}
