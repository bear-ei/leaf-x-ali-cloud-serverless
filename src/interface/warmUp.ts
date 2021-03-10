import { HandleErrorResult } from './error'
import { InvokeConfig, InvokeResult } from './invoke'

/**
 * Warm-up configuration.
 */
export type warmUpConfig = InvokeConfig

/**
 * Warm-up function.
 *
 * @param serviceName       Service name.
 * @param functionNames     Function names.
 */
export interface WarmUpFunction {
  (serviceName: string, functionNames: string[]): Promise<
    (HandleErrorResult | InvokeResult)[]
  >
}

/**
 * Initialize the warm-up function，Reduce cold starts by running functions in
 * a minimal access manner.
 */
export interface InitWarmUpFunction {
  (config: warmUpConfig): WarmUpFunction
}

/**
 * Execute the warm-up.
 *
 * @param serviceName   Service name.
 * @param functionName  Function name.
 */
export interface ExecWarmUpFunction {
  (serviceName: string): (
    functionName: string
  ) => Promise<HandleErrorResult | InvokeResult>
}
