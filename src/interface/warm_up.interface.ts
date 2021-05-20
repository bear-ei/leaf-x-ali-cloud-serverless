import {EventTypeString} from '../enum/event.enum';
import {HandleErrorResult} from './error.interface';
import {InitInvokeOptions} from './invoke.interface';
import {ResponseResult} from './response.interface';

/**
 * Warm-up serverless options.
 */
export interface WarmUpOptions {
  /**
   * Event type.
   */
  type: EventTypeString;

  /**
   * Function name.
   */
  functionName: string;
}

/**
 * Warm-up serverless results.
 *
 * @extends ResponseResult
 */
export interface WarmUpResult extends ResponseResult {
  /**
   * Service name.
   *
   */
  serviceName: string;

  /**
   * Function name.
   */
  functionName: string;
}

/**
 * Initialize warm-up serverless.
 *
 * @param options InitInvokeOptions
 * @return WarmUp
 */
export interface InitWarmUp {
  (options: InitInvokeOptions): WarmUp;
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
  >;
}

/**
 * Initialize the execute of the warm-up serverless.
 *
 * @param serviceName Service name.
 * @param options InitInvokeOptions
 * @return ExecWarmUp
 */
export interface InitExecWarmUp {
  (serviceName: string, options: InitInvokeOptions): ExecWarmUp;
}

/**
 * Execute warm-up.
 *
 * @param options WarmUpOptions
 * @return Promise<HandleErrorResult | WarmUpResult>
 */
export interface ExecWarmUp {
  (options: WarmUpOptions): Promise<HandleErrorResult | WarmUpResult>;
}
