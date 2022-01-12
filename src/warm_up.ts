import {EventTypeString} from './event';
import {initInvoke, InitInvokeOptions} from './invoke';

/**
 * Warm-up function options.
 */
export interface WarmUpOptions {
  /**
   * Trigger event type enumeration string.
   */
  type: EventTypeString;

  /**
   * Name of the function to be warmed up.
   */
  functionName: string;
}

/**
 * Execute the warm-up function.
 *
 * @param serviceName Name of the service to be warmed up.
 * @param options Warm-up function options.
 * @param initInvokeOptions Initialize the options for invoke the function.
 */
const execWarmUp = async (
  serviceName: string,
  {type, functionName}: WarmUpOptions,
  initInvokeOptions: InitInvokeOptions
) => {
  const invoke = initInvoke(initInvokeOptions);

  try {
    const result = await invoke({
      serviceName,
      functionName,
      event: {
        type,
        data: {httpMethod: 'OPTIONS', headers: {'x-warm-up': 'warmUp'}},
      },
    });

    return {...result, serviceName, functionName};
  } catch (error) {
    return error;
  }
};

/**
 * Initialize the execution of the warm-up function.
 *
 * @param serviceName Name of the service to be warmed up.
 * @param initInvokeOptions Initialize the options for invoke the function.
 */
const initExecWarmUp =
  (serviceName: string, initInvokeOptions: InitInvokeOptions) =>
  (options: WarmUpOptions) =>
    execWarmUp(serviceName, options, initInvokeOptions);

/**
 * Warm-up function.
 *
 * @param serviceName Name of the service to be warmed up.
 * @param options Warm-up function options.
 * @param initInvokeOptions Initialize the options for invoke the function.
 */
const warmUp = (
  serviceName: string,
  options: WarmUpOptions[],
  initInvokeOptions: InitInvokeOptions
) => {
  const warmUpFun = initExecWarmUp(serviceName, initInvokeOptions);

  return Promise.all(options.map(warmUpFun));
};

/**
 * Initialize the warm-up function.
 *
 * @param initInvokeOptions Initialize the options for invoke the function.
 */
export const initWarmUp =
  (initInvokeOptions: InitInvokeOptions) =>
  (serviceName: string, options: WarmUpOptions[]) =>
    warmUp(serviceName, options, initInvokeOptions);
