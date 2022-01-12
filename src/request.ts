import fetch, {FetchOptions} from '@leaf-x/fetch';
import {initHandleRequestHeaders} from './headers';
import {AliCloudOptions} from './serverless';

/**
 * Initialize request options.
 */
export interface InitRequestOptions extends AliCloudOptions {
  /**
   * Request host address.
   */
  host: string;
}

/**
 * Request options.
 */
export interface RequestOptions extends FetchOptions {
  /**
   * Whether the current request is an asynchronous request.
   */
  async?: boolean;
}

/**
 * Initiate a network request.
 *
 * @param url Request URL.
 * @param initRequestOptions Initialize request options.
 * @param [options={}] Request options.
 */
const request = (
  url: string,
  initRequestOptions: InitRequestOptions,
  options: RequestOptions = {}
) => {
  const {method = 'GET', body = '', timeout, async} = options;
  const handleRequestHeaders = initHandleRequestHeaders(initRequestOptions);
  const headers = handleRequestHeaders({
    url,
    method,
    content: body as string,
    async,
  });

  return fetch(url, {
    method,
    headers,
    ...(body ? {body} : undefined),
    timeout,
  });
};

/**
 * Initialization request.
 *
 * @param initRequestOptions Initialize request options.
 */
export const initRequest =
  (initRequestOptions: InitRequestOptions) =>
  (url: string, options?: RequestOptions) =>
    request(url, initRequestOptions, options);
