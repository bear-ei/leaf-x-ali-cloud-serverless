import {
  HandleError,
  InitHandleServerlessError,
} from './interface/error.interface';

export const handleError: HandleError = (
  error,
  {serviceName, functionName, requestId, env}
) => {
  const status = (error.status ?? 500) as number;
  const code =
    error.code && typeof error.code === 'number' ? error.code : status;

  const err = error.status && error.code ? error : {details: error};
  const currentApis = [{serviceName, functionName, requestId, env}];
  const message = (error.message ??
    `${serviceName} ${functionName} invoke failed.`) as string;

  const apis = Array.isArray(err.apis)
    ? currentApis.concat(err.apis)
    : currentApis;

  return {
    ...err,
    status,
    code,
    serviceName,
    functionName,
    requestId,
    message,
    env,
    apis,
  };
};

export const initHandleServerlessError: InitHandleServerlessError =
  options => error => {
    throw handleError(error, options);
  };
