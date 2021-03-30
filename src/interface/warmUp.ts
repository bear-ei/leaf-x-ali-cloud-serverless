import { HandleErrorResult } from './error'
import { EventType } from './event'
import { InvokeConfig, InvokeResult } from './invoke'

/**
 * Warm-up options.
 */
export interface WarmUpOptions {
  /**
   * Event type.
   */
  type: EventType

  /**
   * Function name.
   */
  functionName: string
}

/**
 * Warm-up result.
 */
export interface WarmUpResult extends InvokeResult {
  /**
   * Service name.
   */
  serviceName: string

  /**
   * Function name.
   */
  functionName: string
}

/**
 * Warm-up.
 *
 * @param serviceName       Service name.
 */
export interface WarmUpFunction {
  (serviceName: string, options: WarmUpOptions[]): Promise<
    (HandleErrorResult | WarmUpResult)[]
  >
}

/**
 * Initialization warm-up.
 */
export interface InitWarmUpFunction {
  (config: InvokeConfig): WarmUpFunction
}

/**
 * Execute the warm-up.
 *
 * @param serviceName   Service name.
 */
export interface ExecWarmUpFunction {
  (serviceName: string): (
    options: WarmUpOptions
  ) => Promise<HandleErrorResult | WarmUpResult>
}
