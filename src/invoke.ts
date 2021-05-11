import {initHandleServerlessError} from './error';
import {handleEvent} from './event';
import {
  InitExecInvoke,
  InitInvoke,
  InitInvokeError,
  InitRetryInvoke,
} from './interface/invoke.interface';
import {initRequest} from './request';
import {response} from './response';

const initExecInvoke: InitExecInvoke = initInvokeOptions => (
  {retryNumber},
  {url, options}
) => {
  const retryInvoke = initRetryInvoke(
    {initInvokeOptions, retryNumber},
    {url, options}
  );

  return initRequest(initInvokeOptions)(url, options).catch(retryInvoke);
};

const initRetryInvoke: InitRetryInvoke = (
  {retryNumber, initInvokeOptions},
  {url, options}
) => error => {
  if (retryNumber > 0) {
    retryNumber--;

    return initExecInvoke(initInvokeOptions)({retryNumber}, {url, options});
  }

  throw error;
};

const initInvokeError: InitInvokeError = options => error => {
  const requestId = (error as Record<string, Record<string, unknown>>).headers[
    'x-fc-request-id'
  ] as string;

  return initHandleServerlessError({...options, requestId})(error);
};

export const initInvoke: InitInvoke = ({
  qualifier,
  endpoint,
  version,
  ...args
}) => async ({serviceName, functionName, async = false, event}) => {
  const path = `/services/${serviceName}.${qualifier}/functions/${functionName}/invocations`;
  const url = `${endpoint}/${version}${path}`;
  const body = JSON.stringify(handleEvent(event));
  const invokeError = initInvokeError({
    serviceName,
    functionName,
    env: qualifier,
  });

  const result = await initExecInvoke({qualifier, endpoint, version, ...args})(
    {retryNumber: 3},
    {url, options: {method: 'POST', body, async}}
  ).catch(invokeError);

  return response({type: event.type, response: result});
};
