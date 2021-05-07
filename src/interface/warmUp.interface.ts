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
 * Warm-up result.
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
 * Initialize warm-up.
 *
 * @param options InitInvokeOptions
 * @return WarmUp
 */
export interface InitWarmUp {
  (options: InitInvokeOptions): WarmUp
}

/**
 * Warm-up serverless.
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
   * Initialize invoke options.
   */
  options: InitInvokeOptions

  /**
   * Service name.
   */
  serviceName: string
}

/**
 * Initialize the execute warm-up.
 *
 * @param serviceName Service name.
 * @return ExecWarmUp
 */
export interface InitExecWarmUp {
  (options: ExecWarmUpOptions): ExecWarmUp
}

/**
 * Execute warm-up.
 *
 * @param options WarmUpOptions
 * @return Promise<HandleErrorResult | WarmUpResult>
 */
export interface ExecWarmUp {
  (options: WarmUpOptions): Promise<HandleErrorResult | WarmUpResult>
}
