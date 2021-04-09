import { HandleErrorResult } from './error.interface'
import { EventType } from './event.interface'
import { InvokeConfig, InvokeResult } from './invoke.interface'

/**
 * Warm up the serverless options.
 */
export interface WarmUpOptions {
  /**
   * Serverless request event type.
   */
  type: EventType

  /**
   * Name of the function to invoke serverless.
   */
  functionName: string
}

/**
 * Warm up the serverless results.
 */
export interface WarmUpResult extends InvokeResult {
  /**
   * Name of the service that invoke serverless.
   */
  serviceName: string

  /**
   * Name of the function to invoke serverless.
   */
  functionName: string
}

/**
 * Warm up serverless function.
 *
 * @param serviceName Name of the service that invoke serverless.
 */
export interface WarmUpFunction {
  (serviceName: string, options: WarmUpOptions[]): Promise<
    (HandleErrorResult | WarmUpResult)[]
  >
}

/**
 * Initialize the warm up serverless function.
 */
export interface InitWarmUpFunction {
  (config: InvokeConfig): WarmUpFunction
}

/**
 * Execute warm up serverless function.
 *
 * @param serviceName Name of the service that invoke serverless.
 */
export interface ExecWarmUpFunction {
  (serviceName: string): (
    options: WarmUpOptions
  ) => Promise<HandleErrorResult | WarmUpResult>
}
