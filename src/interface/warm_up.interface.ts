import {EventTypeString} from '../enum/event.enum';
import {HandleErrorResult} from './error.interface';
import {InitInvokeOptions} from './invoke.interface';
import {ResponseResult} from './response.interface';

/**
 * Warm-up the serverless options.
 */
export interface WarmUpOptions {
  /**
   * Serverless event type.
   */
  type: EventTypeString;

  /**
   * Serverless function name.
   */
  functionName: string;
}

/**
 * Warm-up serverless result.
 *
 * @extends ResponseResult
 */
export interface WarmUpResult extends ResponseResult {
  /**
   * Serverless service name.
   *
   */
  serviceName: string;

  /**
   * Serverless function name.
   */
  functionName: string;
}

/**
 * Initialize the function that warm-up serverless.
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
 * @param serviceName Serverless service name.
 * @param options WarmUpOptions[]
 * @return Promise<(HandleErrorResult | WarmUpResult)[]>
 */
export interface WarmUp {
  (serviceName: string, options: WarmUpOptions[]): Promise<
    (HandleErrorResult | WarmUpResult)[]
  >;
}

/**
 * Initialize the function that execute the warm-up of serverless.
 *
 * @param serviceName Serverless service name.
 * @param options InitInvokeOptions
 * @return ExecWarmUp
 */
export interface InitExecWarmUp {
  (serviceName: string, options: InitInvokeOptions): ExecWarmUp;
}

/**
 * Execute warm-up serverless.
 *
 * @param options WarmUpOptions
 * @return Promise<HandleErrorResult | WarmUpResult>
 */
export interface ExecWarmUp {
  (options: WarmUpOptions): Promise<HandleErrorResult | WarmUpResult>;
}
