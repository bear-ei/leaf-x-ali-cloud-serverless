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
 * @param options Function warm-up options.
 * @param initInvokeOptions Initialize the options for invoke the function.
 */
const execWarmUp = (
  serviceName: string,
  {type, functionName}: WarmUpOptions,
  initInvokeOptions: InitInvokeOptions
) => {
  const invoke = initInvoke(initInvokeOptions);

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
 * @param initInvokeOptions Initialize the options for invoke the function.
 */
const initExecWarmUp =
  (serviceName: string, initInvokeOptions: InitInvokeOptions) =>
  (options: WarmUpOptions) =>
    execWarmUp(serviceName, options, initInvokeOptions);

/**
 * Function warm-up.
 *
 * @param serviceName Service name.
 * @param options Function warm-up options.
 * @param initInvokeOptions Initialize the options for invoke the function.
 */
const warmUp = (
  serviceName: string,
  options: WarmUpOptions[],
  initInvokeOptions: InitInvokeOptions
) => {
  const execWarmUp = initExecWarmUp(serviceName, initInvokeOptions);

  return Promise.all(options.map(execWarmUp));
};

/**
 * Initialize the function to warm up the function.
 *
 * @param initInvokeOptions Initialize the options for invoke the function.
 */
export const initWarmUp =
  (initInvokeOptions: InitInvokeOptions) =>
  (serviceName: string, options: WarmUpOptions[]) =>
    warmUp(serviceName, options, initInvokeOptions);
