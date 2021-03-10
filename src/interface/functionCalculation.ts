import { InvokeFunction } from './invoke'
import { WarmUpFunction } from './warmUp'

/**
 * Function calculation options.
 */
export interface FunctionCalculationOptions {
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
   * Request timeout time in milliseconds, default value 30000.
   */
  timeout?: number

  /**
   * Function version alias, default value LATEST.
   */
  qualifier?: string

  /**
   * Whether to use intranet requests, default value true.
   */
  internal?: boolean

  /**
   * If or not request protection is enabled, if it is enabled https request
   * will be used, otherwise http request will be used, default value false.
   */
  secure?: boolean

  /**
   * Function to calculate api version, default value 2016-08-15.
   */
  version?: string
}

/**
 * The result of the function calculation.
 */
export interface FunctionCalculationResult {
  /**
   * Invoke function.
   */
  invoke: InvokeFunction

  /**
   * Warm-up function.
   */
  warmUp: WarmUpFunction
}

/**
 * Function calculation.
 */
export interface FunctionCalculationFunction {
  (options: FunctionCalculationOptions): FunctionCalculationResult
}
