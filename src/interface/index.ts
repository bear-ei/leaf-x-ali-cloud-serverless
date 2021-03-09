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
   * Request timeout time, in milliseconds.
   */
  timeout?: number

  /**
   * Function to calculate version aliases.
   */
  qualifier?: string

  /**
   * Whether the request is made through the intranet.
   */
  internal?: boolean

  /**
   * Whether protection is enabled, if so HTTPS requests will be used, otherwise
   * HTTP requests will be used.
   */
  secure?: boolean

  /**
   * Function to calculate the api version.
   */
  version?: string
}

/**
 * The function calculates the initialization result.
 */
export interface FCResult {
  invoke: (
    serviceName: string,
    functionName: string,
    options: InvokeOptions
  ) => Promise<InvokeResult>

  warmUp: (
    serviceName: string,
    functionNames: string[]
  ) => Promise<(HandleErrorResult | InvokeResult)[]>
}

/**
 * Get function calculation method function.
 */
export interface FCFunction {
  (options: FCOptions): FCResult
}

/**
 * Function invoke options.
 */
export interface InvokeOptions {
  /**
   * Invoke the event.
   */
  event: EventOptions

  /**
   * Whether to execute asynchronous requests.
   */
  async?: boolean
}

/**
 * Function invoke configuration.
 */
export interface InvokeConfig extends RequestConfig {
  /**
   * Invoke the endpoint.
   */
  endpoint: string

  /**
   * Function to calculate the api version.
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
   * Response header.
   */
  headers: Record<string, unknown>
}

/**
 * Invoke the function to calculate the function.
 *
 * @param serviceName   Service name.
 * @param functionName  Function name.
 */
export interface InvokeFunction {
  (config: InvokeConfig): (
    serviceName: string,
    functionName: string,
    options: InvokeOptions
  ) => Promise<InvokeResult>
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
   * Ali cloud access key.
   */
  accessSecretKey: string

  /**
   * Request timeout time, in milliseconds.
   */
  timeout: number

  /**
   * Function to calculate version aliases.
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
 * Request function.
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
 * Response function.
 */
export interface ResponseFunction {
  (options: ResponseOptions): ResponseResult
}

/**
 * Warm-up configuration.
 */
export type warmUpConfig = InvokeConfig

/**
 * Warm-up function.
 * Reduce cold starts by running functions in a minimal access manner.
 *
 * @param serviceName Service name.
 * @param functionNames Function names.
 */
export interface WarmUpFunction {
  (config: warmUpConfig): (
    serviceName: string,
    functionNames: string[]
  ) => Promise<(HandleErrorResult | InvokeResult)[]>
}

/**
 * Handle error options.
 */
export interface HandleErrorOptions {
  /**
   * Service name.
   */
  serviceName: string

  /**
   * Function name.
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
 * Handle error results.
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
 * Handle error function.
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
   * Whether or not to Base64 encode the data.
   */
  isBase64Encoded: boolean

  /**
   * Response header.
   */
  headers: Record<string, string>

  /**
   * Response body.
   */
  body: unknown
}

/**
 * Handle response error options.
 */
export interface HandleRequestErrorOptions {
  /**
   * Service name.
   */
  serviceName: string

  /**
   * Function name.
   */
  functionName: string

  /**
   * Function to calculate version aliases.
   */
  qualifier: string
}
