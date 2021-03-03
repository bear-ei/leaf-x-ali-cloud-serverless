import { EventOptions } from './util'
;('use strict')

/**
 * Function calculation options.
 */
export interface FCOptions {
  /**
   * AliCloud account id.
   */
  accountId: string

  /**
   * Access id.
   */
  accessId: string

  /**
   * Access Key.
   */
  accessSecretKey: string

  /**
   * Request region.
   */
  region: string

  /**
   * Request timeout time, in milliseconds. Default value 30000.
   */
  timeout?: number

  /**
   * Version alias, default value LATEST.
   */
  qualifier?: string

  /**
   * Whether to request via intranet, default value true.
   */
  internal?: boolean

  /**
   * Whether to enable protection, enable protection will use https. default value false.
   */
  secure?: boolean

  /**
   * AliCloud api version, default value 2016-08-15.
   */
  version?: string
}

/**
 * FC Results.
 */
export interface FCResult {
  invoke: (options: InvokeOptions) => Promise<InvokeResult>
  preheat: (
    options: PreheatOptions
  ) => Promise<(HandleErrorResult | InvokeResult)[]>
}

/**
 * Get FC method.
 */
export interface FCFunction {
  (options: FCOptions): FCResult
}

/**
 * Invoke options.
 */
export interface InvokeOptions {
  /**
   * Service name.
   */
  serviceName: string

  /**
   * Function name.
   */
  functionName: string

  /**
   * Request events.
   */
  event: EventOptions

  /**
   * Whether to request asynchronously.
   */
  isAsync?: boolean
}

/**
 * Invoke configuration.
 */
export interface InvokeConfig extends RequestConfig {
  /**
   * Request endpoint.
   */
  endpoint: string

  /**
   * AliCloud api version, default value 2016-08-15.
   */
  version: string
}

/**
 * Invoke results.
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
   * Response headers
   */
  headers: Record<string, unknown>
}

/**
 * Invoke the specified function.
 */
export interface InvokeFunction {
  (config: InvokeConfig): (options: InvokeOptions) => Promise<InvokeResult>
}

/**
 * Request configuration.
 */
export interface RequestConfig {
  /**
   * Request host.
   */
  host: string

  /**
   * AliCloud account id.
   */
  accountId: string

  /**
   * Access id.
   */
  accessId: string

  /**
   * Access Key.
   */
  accessSecretKey: string

  /**
   * Request timeout time, in milliseconds.
   */
  timeout: number

  /**
   * Version Alias.
   */
  qualifier: string
}

/**
 *  Request options.
 */
export interface RequestOptions extends InvokeOptions {
  /**
   * Request url.
   */
  url: string
}

/**
 * Request Results.
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
   * Response headers.
   */
  headers: Record<string, string>

  [key: string]: unknown
}

/**
 * Execute remote requests.
 */
export interface RequestFunction {
  (config: RequestConfig, options: RequestOptions): Promise<RequestResult>
}

/**
 * Response options.
 */
export type ResponseOptions = RequestResult

/**
 * Response results.
 */
export type ResponseResult = InvokeResult

/**
 * Handle response data.
 */
export interface ResponseFunction {
  (options: ResponseOptions): ResponseResult
}

/**
 * Preheat configuration.
 */
export type PreheatConfig = InvokeConfig

/**
 * Preheat options.
 */
export interface PreheatOptions {
  /**
   * Service name.
   */
  serviceName: string

  /**
   * Function names.
   */
  functionNames: string[]
}

/**
 * Preheat functions.
 * Reduce cold starts by running functions in a minimal access manner.
 */
export interface PreheatFunction {
  (config: PreheatConfig): (
    options: PreheatOptions
  ) => Promise<(HandleErrorResult | InvokeResult)[]>
}

/**
 * Generate error data options.
 */
export interface HandleErrorOptions {
  /**
   * Service name.
   */
  serviceName: string

  /**
   * function name.
   */
  functionName: string

  /**
   * Request id.
   */
  requestId?: string

  /**
   * Running environment.
   */
  env: string
}

/**
 * Generate error data results.
 */
export interface HandleErrorResult extends HandleErrorOptions {
  /**
   * Response status code.
   */
  status: number

  /**
   * Response error code.
   */
  code: number

  /**
   * Response error message.
   */
  message: string

  /**
   * Invoke chain information.
   */
  apis?: HandleErrorOptions[]

  /**
   * Error details.
   */
  details?: unknown
}

/**
 * Handle error data.
 */
export interface HandleErrorFunction {
  (
    options: HandleErrorOptions,
    error: Record<string, unknown>
  ): HandleErrorResult
}

/**
 * AliCloud Gateway options.
 */
export interface AliCloudGatewayOptions {
  /**
   * Response status code.
   *
   */
  statusCode: number

  /**
   * Whether base64 encoding.
   */
  isBase64Encoded: boolean

  /**
   * Response headers.
   */
  headers: Record<string, string>

  /**
   * Response data.
   */
  body: unknown
}

/**
 * Handle AliCloud gateway responses.
 */
export interface AliCloudGatewayDataFunction {
  (options: AliCloudGatewayOptions): ResponseResult | never
}

/**
 * Execution request options.
 */
export interface ExecRequestOptions {
  config: RequestConfig
  options: RequestOptions
}

/**
 * Execution request.
 *
 * @param retryNum Retry times.
 */
export interface ExecRequestFunction {
  (retryNum: number, options: ExecRequestOptions): Promise<RequestResult>
}

/**
 * Retry request.
 *
 * @param retry Retry times.
 * @param error Error.
 */
export interface RetryRequestFunction {
  (retry: number, error: Record<string, Record<string, unknown>>):
    | Promise<RequestResult>
    | never
}

/**
 * Handle request errors.
 *
 * @export
 * @interface HandleRequestErrorFunction
 */
export interface HandleRequestErrorFunction {
  (error: Record<string, unknown>): never
}
