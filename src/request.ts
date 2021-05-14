import {fetch} from '@leaf-x/fetch';
import {initGetRequestHeaders} from './headers';
import {InitRequest} from './interface/request.interface';

export const initRequest: InitRequest = initRequestOptions => async (
  url,
  options
) => {
  const {method = 'GET', body = '', timeout, async} = options ?? {};
  const headers = initGetRequestHeaders(initRequestOptions)({
    url,
    method,
    content: body as string,
    async,
  });

  return fetch(url, {method, headers, ...(body ? {body} : undefined), timeout});
};
