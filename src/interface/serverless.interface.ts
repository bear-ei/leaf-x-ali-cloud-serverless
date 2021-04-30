import { Invoke } from './invoke.interface'
import { WarmUp } from './warmUp.interface'

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
   * Region where serverless is located.
   */
  region: string

  /**
   * Invoke serverless timeout in milliseconds.
   *
   * @Default 3000
   */
  timeout?: number

  /**
   * Serverless qualifier.
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
   * Serverless API version.
   *
   * Default: 2016-08-15
   */
  version?: string
}

/**
 * Serverless results.
 */
export interface ServerlessResult {
  invoke: Invoke
  warmUp: WarmUp
}

/**
 * Serverless API.
 *
 * @param options ServerlessOptions
 * @return ServerlessResult
 */
export interface Serverless {
  (options: ServerlessOptions): ServerlessResult
}
