import { HandleErrorResult } from './error.interface'
import { EventType } from './event.interface'
import { InitInvokeOptions } from './invoke.interface'
import { ResponseResult } from './response.interface'

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
 * Warm-up results.
 */
export interface WarmUpResult extends ResponseResult {
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
 * @param serviceName Service name.
 */
export interface WarmUp {
  (serviceName: string, options: WarmUpOptions[]): Promise<
    (HandleErrorResult | WarmUpResult)[]
  >
}

/**
 * Initialization warm-up.
 */
export interface InitWarmUp {
  (options: InitInvokeOptions): WarmUp
}

export interface ExecWarmUpOptions {
  serviceName: string
  options: InitInvokeOptions
}

/**
 * Execute the warm-up.
 *
 * @param serviceName Service name.
 */
export interface ExecWarmUp {
  (options: ExecWarmUpOptions): (
    options: WarmUpOptions
  ) => Promise<HandleErrorResult | WarmUpResult>
}
