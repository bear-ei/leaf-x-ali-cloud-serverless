import { InvokeFunction } from './invoke'
import { WarmUpFunction } from './warmUp'

/**
 * Serverless options.
 */
export interface ServerlessOptions {
  /**
   * Ali cloud account ID.
   */
  accountId: string

  /**
   * Ali cloud access ID.
   */
  accessId: string

  /**
   * Ali cloud access key.
   */
  accessSecretKey: string

  /**
   * Serverless region.
   */
  region: string

  /**
   * Invoke timeout time in milliseconds, default 3000.
   */
  timeout?: number

  /**
   * Serverless version alias, default LATEST.
   */
  qualifier?: string

  /**
   * Whether to access via intranet, default true.
   */
  internal?: boolean

  /**
   * Whether to enable request protection, if enabled will use https to
   * initiate the request, otherwise will use http to initiate the request,
   * default false.
   */
  secure?: boolean

  /**
   * Serverless api version, default 2016-08-15.
   */
  version?: string
}

/**
 * Serverless results.
 */
export interface ServerlessResult {
  /**
   * Invoke.
   */
  invoke: InvokeFunction

  /**
   * Warm-up.
   */
  warmUp: WarmUpFunction
}

/**
 * Serverless.
 */
export interface ServerlessFunction {
  (options: ServerlessOptions): ServerlessResult
}
