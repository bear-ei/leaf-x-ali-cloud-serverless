import { InvokeFunction } from './invoke'
import { WarmUpFunction } from './warmUp'

/**
 * Serverless options.
 */
export interface ServerlessOptions {
  /**
   * AliCloud account id.
   */
  accountId: string

  /**
   * AliCloud serverless access id.
   */
  accessId: string

  /**
   * AliCloud serverless access key.
   */
  accessSecretKey: string

  /**
   * Serverless region.
   */
  region: string

  /**
   * Request timeout time in milliseconds, default value 30000.
   */
  timeout?: number

  /**
   * Serverless version alias, default value LATEST.
   */
  qualifier?: string

  /**
   * Whether to use intranet requests, default value true.
   */
  internal?: boolean

  /**
   * Whether to enable request protection, if enabled https requests will be
   * used, otherwise http requests will be used, default value is false.
   */
  secure?: boolean

  /**
   * Serverless api version, default value 2016-08-15.
   */
  version?: string
}

/**
 * Serverless result.
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
