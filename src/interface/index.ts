'use strict'

import { AxiosResponse } from 'axios'
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
   * Ali cloud api version, default value 2016-08-15.
   */
  version?: string
}

/**
 * FC Results.
 */
export interface FCResult {
  invoke: InvokeFunction
  warmUp: WarmUpFunction
}

/**
 * FC.
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
   * Request headers.
   */
  headers?: Record<string, string>

  /**
   * Whether to request asynchronously.
   */
  isAsync?: boolean
}

/**
 * Invoking configuration.
 */
export interface InvokeConfig extends RequestConfig {
  /**
   * Request endpoint.
   */
  endpoint: string

  /**
   * Ali cloud api version, default value 2016-08-15.
   */
  version: string
}

/**
 * Invoking results.
 */
export interface InvokeResult {
  /**
   * Response data.
   */
  data: Record<string, unknown>

  /**
   * Response status code.
   */
  status: number
}

/**
 * Invoking the specified function.
 */
export interface InvokeFunction {
  (config: InvokeConfig, options: InvokeOptions): Promise<InvokeResult>
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
 * Execute remote requests.
 */
export interface RequestFunction {
  (config: RequestConfig, options: RequestOptions): Promise<
    AxiosResponse<unknown>
  >
}

/**
 * Response options.
 */
export interface ResponseOptions {
  /**
   * Response data.
   */
  data: Record<string, unknown>

  /**
   * Response status code.
   */
  status: number

  /**
   * Response headers.
   */
  headers: Record<string, string>
}

/**
 * Response results.
 */
export type ResponseResult = InvokeResult

/**
 * Handling response data.
 */
export interface ResponseFunction {
  (options: ResponseOptions): ResponseResult
}

/**
 * Warm-up configuration.
 */
export type WarmUpConfig = InvokeConfig

/**
 * Warm-up options.
 */
export interface WarmUpOptions {
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
 * Warm-up functions.
 * Reduce cold starts by running functions in a minimal access manner.
 */
export interface WarmUpFunction {
  (config: WarmUpConfig, options: WarmUpOptions): Promise<
    (HandleErrorResult | InvokeResult)[]
  >
}

/**
 * Handling error options.
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
  requestId: string

  /**
   * Running environment.
   */
  env: string

  /**
   * Retry times.
   */
  retry?: number
}

/**
 * Handling error results.
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
   * Invoking chain information.
   */
  apis?: HandleErrorOptions[]

  /**
   * Error details.
   */
  details?: unknown
}

/**
 * Handling errors.
 */
export interface HandleErrorFunction {
  (
    options: HandleErrorOptions,
    error: Record<string, unknown>
  ): HandleErrorResult
}
