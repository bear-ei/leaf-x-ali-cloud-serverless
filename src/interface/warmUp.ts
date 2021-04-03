import { HandleErrorResult } from './error'
import { EventType } from './event'
import { InvokeConfig, InvokeResult } from './invoke'

/**
 * Options for warming up serverless.
 */
export interface WarmUpOptions {
  /**
   * The serverless event type.
   */
  type: EventType

  /**
   * The name of the function to be warm up.
   */
  functionName: string
}

/**
 * Warm up the results of serverless.
 */
export interface WarmUpResult extends InvokeResult {
  /**
   * The name of the service to be warm up.
   */
  serviceName: string

  /**
   * The name of the function to be warm up.
   */
  functionName: string
}

/**
 * Warm up serverless functions.
 *
 * @param serviceName The name of the service to be warm up.
 */
export interface WarmUpFunction {
  (serviceName: string, options: WarmUpOptions[]): Promise<
    (HandleErrorResult | WarmUpResult)[]
  >
}

/**
 * Initialize the function that warm up serverless.
 */
export interface InitWarmUpFunction {
  (config: InvokeConfig): WarmUpFunction
}

/**
 * Execution serverless warm up functions.
 *
 * @export
 * @interface ExecWarmUpFunction
 */
export interface ExecWarmUpFunction {
  (serviceName: string): (
    options: WarmUpOptions
  ) => Promise<HandleErrorResult | WarmUpResult>
}
