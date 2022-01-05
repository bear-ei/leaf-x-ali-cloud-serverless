import {HandleErrorResult} from './error';
import {EventTypeString} from './event';
import {initInvoke, InitInvokeOptions} from './invoke';
import {ResponseResult} from './response';

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
 * Execute warm-up serverless.
 *
 * @param options WarmUpOptions
 * @return Promise<HandleErrorResult | WarmUpResult>
 */
export interface ExecWarmUp {
  (options: WarmUpOptions): Promise<HandleErrorResult | WarmUpResult>;
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
 * Initialize the function that warm-up serverless.
 *
 * @param options InitInvokeOptions
 * @return WarmUp
 */
export interface InitWarmUp {
  (options: InitInvokeOptions): WarmUp;
}

const initExecWarmUp: InitExecWarmUp = (serviceName, options) => {
  const invoke = initInvoke(options);

  return ({functionName, type}) =>
    invoke({
      serviceName,
      functionName,
      event: {
        type,
        data: {httpMethod: 'OPTIONS', headers: {'x-warm-up': 'warmUp'}},
      },
    })
      .then(result => ({...result, serviceName, functionName}))
      .catch(error => error);
};

export const initWarmUp: InitWarmUp =
  invokeOptions => (serviceName, options) => {
    const execWarmUp = initExecWarmUp(serviceName, invokeOptions);

    return Promise.all(options.map(execWarmUp));
  };
