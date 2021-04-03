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
   * Ali cloud access id.
   */
  accessId: string

  /**
   * Access key for AliCloud.
   */
  accessSecretKey: string

  /**
   * The territory where Serverless is located.
   */
  region: string

  /**
   * The timeout for the invoke, in milliseconds. Default: 3000ms.
   */
  timeout?: number

  /**
   * The requested serverless alias. Default: LATEST.
   */
  qualifier?: string

  /**
   * Whether to invoke serverless through the intranet. Default: true.
   */
  internal?: boolean

  /**
   * If or not invoke protection is enabled, if it is enabled the request will
   * be made using HTTPS, otherwise the request will be made using HTTP.
   */
  secure?: boolean

  /**
   * The requested serverless alias. Default: 2016-08-15.
   */
  version?: string
}

/**
 * The result of serverless.
 */
export interface ServerlessResult {
  /**
   * Invoke the serverless function.
   */
  invoke: InvokeFunction

  /**
   * The function to warm up serverless.
   */
  warmUp: WarmUpFunction
}

/**
 * Serverless functions.
 */
export interface ServerlessFunction {
  (options: ServerlessOptions): ServerlessResult
}
