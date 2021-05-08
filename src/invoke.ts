import {initHandleServerlessError} from './error';
import {handleEvent} from './event';
import {getRequestHeaders} from './headers';
import {
  ExecInvoke,
  InitInvoke,
  InitInvokeError,
  InitRetryInvoke,
} from './interface/invoke.interface';
import {request} from './request';
import {response} from './response';
import {getToken} from './token';

const execInvoke: ExecInvoke = (retryNumber, {url, options}) => {
  const retryInvoke = initRetryInvoke(retryNumber, {url, options});

  return request(url, options).catch(retryInvoke);
};

const initRetryInvoke: InitRetryInvoke = (
  {retryNumber},
  {url, options}
) => error => {
  if (retryNumber > 0) {
    retryNumber--;

    return execInvoke({retryNumber}, {url, options});
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
  host,
  accountId,
  accessSecretKey,
  accessId,
  timeout,
}) => async ({serviceName, functionName, async = false, event}) => {
  const path = `/services/${serviceName}.${qualifier}/functions/${functionName}/invocations`;
  const url = `${endpoint}/${version}${path}`;
  const method = 'POST';
  const body = JSON.stringify(handleEvent(event));
  const requestHeaders = getRequestHeaders({
    content: body,
    host,
    accountId,
    async,
  });

  const authorization = getToken({
    accessId,
    accessSecretKey,
    method,
    url,
    headers: requestHeaders,
  });

  const execInvokeOptions = {
    url,
    options: {
      method,
      headers: {authorization, ...requestHeaders},
      body,
      timeout,
    },
  };

  const invokeError = initInvokeError({
    serviceName,
    functionName,
    env: qualifier,
  });

  const result = await execInvoke({retryNumber: 3}, execInvokeOptions).catch(
    invokeError
  );

  return response({type: event.type, response: result});
};
