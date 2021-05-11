import {InitExecWarmUp, InitWarmUp} from './interface/warm_up.interface';
import {initInvoke} from './invoke';

const initExecWarmUp: InitExecWarmUp = ({serviceName, options}) => {
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
    const execWarmUp = initExecWarmUp({serviceName, options: invokeOptions});

    return Promise.all(options.map(execWarmUp));
  };
