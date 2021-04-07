import { InvokeFunction } from './invoke'
import { WarmUpFunction } from './warmUp'

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
   * Ali cloud access key.
   */
  accessSecretKey: string

  /**
   * Serverless region.
   */
  region: string

  /**
   * Request timeout time in milliseconds. Default: 3000.
   */
  timeout?: number

  /**
   * Serverless service alias.  Default: LATEST.
   */
  qualifier?: string

  /**
   * Whether to invoke the serverless function through the intranet.
   * Default: true.
   */
  internal?: boolean

  /**
   * If or not invoke protection is enabled, HTTPS will be used if enabled,
   * otherwise HTTP will be used. Default: true.
   */
  secure?: boolean

  /**
   * Invoke the serverless API version.  Default: '2016-08-15'.
   */
  version?: string
}

/**
 * Serverless results.
 */
export interface ServerlessResult {
  /**
   * Invoke serverless.
   */
  invoke: InvokeFunction

  /**
   * Warm up serverless.
   */
  warmUp: WarmUpFunction
}

/**
 * Serverless.
 */
export interface ServerlessFunction {
  (options: ServerlessOptions): ServerlessResult
}
