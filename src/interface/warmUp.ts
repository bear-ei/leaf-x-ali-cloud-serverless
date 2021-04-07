import { HandleErrorResult } from './error'
import { EventType } from './event'
import { InvokeConfig, InvokeResult } from './invoke'

/**
 * Warm up the serverless options.
 */
export interface WarmUpOptions {
  /**
   * Serverless event type.
   */
  type: EventType

  /**
   * The name of the serverless function.
   */
  functionName: string
}

export interface WarmUpResult extends InvokeResult {
  /**
   * The name of the serverless service.
   */
  serviceName: string

  /**
   * The name of the serverless function.
   */
  functionName: string
}

/**
 * Warm up serverless.
 *
 * @param serviceName The name of the serverless service.
 */
export interface WarmUpFunction {
  (serviceName: string, options: WarmUpOptions[]): Promise<
    (HandleErrorResult | WarmUpResult)[]
  >
}

/**
 * Initialize warm-up serverless.
 */
export interface InitWarmUpFunction {
  (config: InvokeConfig): WarmUpFunction
}

/**
 * Execute warm-up serverless.
 */
export interface ExecWarmUpFunction {
  (serviceName: string): (
    options: WarmUpOptions
  ) => Promise<HandleErrorResult | WarmUpResult>
}
