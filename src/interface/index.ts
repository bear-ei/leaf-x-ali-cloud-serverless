'use strict'

import { EventOptions } from './util'

/**
 * Function calculation options.
 */
export interface FCOptions {
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
   * Function calculation region.
   */
  region: string

  /**
   * Request timeout time in milliseconds, default value 3000.
   */
  timeout?: number

  /**
   * Function to calculate aliases, default value LATEST.
   */
  qualifier?: string

  /**
   * Whether to access via intranet, default value true.
   */
  internal?: boolean

  /**
   * If or not access protection is enabled, HTTPS will be used if enabled, otherwise HTTP will be used.
   * Default value false.
   */
  secure?: boolean

  /**
   * Function calculate api version,default value 2016-08-15.
   */
  version?: string
}

/**
 * Result of function calculation.
 */
export interface FCResult {
  invoke: (options: InvokeOptions) => Promise<InvokeResult>
  warmUp: (
    serviceName: string,
    functionNames: string[]
  ) => Promise<(HandleErrorResult | InvokeResult)[]>
}

/**
 * Get the function calculation method.
 */
export interface FCFunction {
  (options: FCOptions): FCResult
}

/**
 * Invoke function options.
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
   * Invoke events.
   */
  event: EventOptions

  /**
   * Whether to invoke asynchronously or not, default value false.
   */
  async?: boolean
}

/**
 * Invoke the configuration.
 */
export interface InvokeConfig extends RequestConfig {
  /**
   * Invoke endpoints.
   */
  endpoint: string

  /**
   * Function calculate api version.
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
 * Invoke a function to calculate.
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
   * Ali cloud account id.
   */
  accountId: string

  /**
   * Ali cloud access id.
   */
  accessId: string

  /**
   * Ali cloud Access key.
   */
  accessSecretKey: string

  /**
   * Request timeout time in milliseconds.
   */
  timeout: number

  /**
   * Function calculate api version.
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
 * warmUp configuration.
 */
export type warmUpConfig = InvokeConfig

/**
 * Warm-up functions.
 * Reduce cold starts by running functions in a minimal access manner.
 *
 * @param serviceName Service name.
 * @param functionNames Function names.
 */
export interface warmUpFunction {
  (config: warmUpConfig): (
    serviceName: string,
    functionNames: string[]
  ) => Promise<(HandleErrorResult | InvokeResult)[]>
}

/**
 * Handle error data options.
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
 * Handle error data results.
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
 * Ali cloud gateway options.
 */
export interface AliCloudGatewayOptions {
  /**
   * Response status code.
   */
  statusCode: number

  /**
   * Base64 encoding or not.
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
 * Handle Ali cloud gateway responses.
 */
export interface AliCloudGatewayResponseFunction {
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

export interface HandleRequestErrorOptions {
  serviceName: string
  functionName: string
  qualifier: string
}

/**
 * Handle request errors.
 */
export interface HandleRequestErrorFunction {
  (options: HandleRequestErrorOptions, error: Record<string, unknown>): never
}
