import {initHandleServerlessError} from './error';
import {handleTriggerEvent} from './event';
import {
  InitExecInvoke,
  InitHandleInvokeError,
  InitInvoke,
  InitRetryInvoke,
} from './interface/invoke.interface';
import {initRequest} from './request';
import {handleResponse} from './response';

const initExecInvoke: InitExecInvoke = initRequestOptions => (
  {retryNumber},
  {url, options}
) => {
  const retryInvoke = initRetryInvoke(
    {initRequestOptions, retryNumber},
    {url, options}
  );

  return initRequest(initRequestOptions)(url, options).catch(retryInvoke);
};

const initRetryInvoke: InitRetryInvoke = (
  {retryNumber, initRequestOptions},
  {url, options}
) => error => {
  if (retryNumber > 0) {
    retryNumber--;

    return initExecInvoke(initRequestOptions)({retryNumber}, {url, options});
  }

  throw error;
};

const initHandleInvokeError: InitHandleInvokeError = options => error => {
  const headers = (error.headers ?? {}) as Record<string, unknown>;
  const requestId = headers['x-fc-request-id'] as string;

  return initHandleServerlessError({...options, requestId})(error);
};

export const initInvoke: InitInvoke = ({
  qualifier,
  endpoint,
  version,
  timeout,
  ...args
}) => async ({serviceName, functionName, async = false, event}) => {
  const path = `/services/${serviceName}.${qualifier}/functions/${functionName}/invocations`;
  const url = `${endpoint}/${version}${path}`;
  const body = JSON.stringify(handleTriggerEvent(event));
  const handleInvokeError = initHandleInvokeError({
    serviceName,
    functionName,
    env: qualifier,
  });

  const result = await initExecInvoke(args)(
    {retryNumber: 3},
    {url, options: {method: 'POST', body, async, timeout}}
  ).catch(handleInvokeError);

  return handleResponse({type: event.type, response: result});
};
