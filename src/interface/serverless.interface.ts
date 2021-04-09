import { InvokeFunction } from './invoke.interface'
import { WarmUpFunction } from './warmUp.interface'

/**
 * Serverless options.
 */
export interface ServerlessOptions {
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
   * Region where serverless is located.
   */
  region: string

  /**
   * Invoke serverless timeout in milliseconds.
   *
   * Default: 3000
   */
  timeout?: number

  /**
   * Qualifier for serverless.
   *
   * Default: LATEST
   */
  qualifier?: string

  /**
   * Whether to invoke serverless through the intranet.
   *
   * Default: true
   */
  internal?: boolean

  /**
   * Whether to open invoke protection, if open will use https invoke,otherwise
   * use http.
   *
   * Default: true
   */
  secure?: boolean

  /**
   * Serverless api version.
   *
   * Default: 2016-08-15
   */
  version?: string
}

/**
 * Result of serverless.
 */
export interface ServerlessResult {
  /**
   * Invoke serverless function.
   */
  invoke: InvokeFunction

  /**
   * Warm up serverless function.
   */
  warmUp: WarmUpFunction
}

/**
 * Serverless function.
 */
export interface ServerlessFunction {
  (options: ServerlessOptions): ServerlessResult
}
