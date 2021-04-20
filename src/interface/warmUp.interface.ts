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
 *
 * @extends ResponseResult
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
 * Initialization warm-up.
 *
 * @param options InitInvokeOptions
 * @return WarmUp
 */
export interface InitWarmUp {
  (options: InitInvokeOptions): WarmUp
}

/**
 * Warm-up.
 *
 * @param serviceName Service name.
 * @param options WarmUpOptions[]
 * @return Promise<(HandleErrorResult | WarmUpResult)[]>
 */
export interface WarmUp {
  (serviceName: string, options: WarmUpOptions[]): Promise<
    (HandleErrorResult | WarmUpResult)[]
  >
}

/**
 * Execute the warm-up options.
 */
export interface ExecWarmUpOptions {
  /**
   * Service name.
   */
  serviceName: string

  /**
   * Initialize the invoke options.
   */
  options: InitInvokeOptions
}

/**
 * Initial execution warm-up.
 *
 * @param serviceName Service name.
 * @return ExecWarmUp
 */
export interface InitExecWarmUp {
  (options: ExecWarmUpOptions): ExecWarmUp
}

/**
 * Execution warm-up.
 *
 * @param options WarmUpOptions
 * @return Promise<HandleErrorResult | WarmUpResult>
 */
export interface ExecWarmUp {
  (options: WarmUpOptions): Promise<HandleErrorResult | WarmUpResult>
}
