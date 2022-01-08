import {EventTypeString} from './event';
import {initInvoke, InitInvokeOptions} from './invoke';

/**
 * Function warm-up options.
 */
export interface WarmUpOptions {
  /**
   * Event type string.
   */
  type: EventTypeString;

  /**
   * Function name.
   */
  functionName: string;
}

/**
 * Execute function warm-up.
 *
 * @param serviceName
 * @param warmUpOptions Function warm-up options.
 * @param options Initialize the options for invoke the function.
 */
const execWarmUp = (
  serviceName: string,
  {type, functionName}: WarmUpOptions,
  options: InitInvokeOptions
) => {
  const invoke = initInvoke(options);

  return invoke({
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

/**
 * Initialize the function that performs the function warm-up.
 *
 * @param serviceName Service name.
 * @param options Initialize the options for invoke the function.
 */
const initExecWarmUp =
  (serviceName: string, options: InitInvokeOptions) =>
  (warmUpOptions: WarmUpOptions) =>
    execWarmUp(serviceName, warmUpOptions, options);

/**
 * Function warm-up.
 *
 * @param serviceName Service name.
 * @param options Function warm-up options.
 * @param invokeOptions Initialize the options for invoke the function.
 */
const warmUp = (
  serviceName: string,
  options: WarmUpOptions[],
  invokeOptions: InitInvokeOptions
) => {
  const execWarmUp = initExecWarmUp(serviceName, invokeOptions);

  return Promise.all(options.map(execWarmUp));
};

/**
 * Initialize the function to warm up the function.
 *
 * @param invokeOptions Initialize the options for invoke the function.
 */
export const initWarmUp =
  (invokeOptions: InitInvokeOptions) =>
  (serviceName: string, options: WarmUpOptions[]) =>
    warmUp(serviceName, options, invokeOptions);
