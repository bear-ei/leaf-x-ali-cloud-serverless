import {fetch} from '@leaf-x/fetch';
import {getRequestHeaders} from './headers';
import {HttpMethod} from './interface/event.interface';
import {InitRequest} from './interface/request.interface';
import {getToken} from './token';

export const initRequest: InitRequest = ({
  host,
  accountId,
  accessSecretKey,
  accessId,
}) => async (url, options) => {
  const {method = 'GET', body = '', timeout, async} = options ?? {};
  const headers = getRequestHeaders({
    content: body as string,
    host,
    accountId,
    async,
  });

  const authorization = getToken({
    accessId,
    accessSecretKey,
    method: method as HttpMethod,
    url,
    headers,
  });

  return fetch(url, {
    method,
    headers: {authorization, ...headers},
    ...(body ? {body} : undefined),
    timeout,
  });
};
