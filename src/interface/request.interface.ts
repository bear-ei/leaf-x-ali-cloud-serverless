import { InvokeOptions } from './invoke.interface'

/**
 * Execute the configuration of serverless requests.
 */
export interface ExecRequestConfig {
  /**
   * Serverless requests host.
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
   * Ali cloud serverless access key.
   */
  accessSecretKey: string

  /**
   * Serverless request timeout time.
   */
  timeout: number

  /**
   * Serverless request api version.
   */
  qualifier: string
}

/**
 * Options to execute serverless requests.
 */
export interface ExecRequestOptions extends InvokeOptions {
  /**
   * Name of the service that request serverless.
   */
  serviceName: string

  /**
   * Name of the function to request serverless.
   */
  functionName: string

  /**
   * Url address of the request serverless.
   */
  url: string
}

/**
 * Result of executing a serverless request.
 */
export interface ExecRequestResult {
  /**
   * Request response status code.
   */
  status: number

  /**
   * Request response data.
   */
  data: unknown

  /**
   * Request response header.
   */
  headers: Record<string, string>

  [key: string]: unknown
}

/**
 * Function to execute serverless requests.
 *
 * @export
 * @interface ExecRequestFunction
 */
export interface ExecRequestFunction {
  (
    options: ExecRequestOptions,
    config: ExecRequestConfig
  ): Promise<ExecRequestResult>
}
