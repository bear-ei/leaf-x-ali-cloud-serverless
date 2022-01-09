import fetch, {FetchOptions} from '@leaf-x/fetch';
import {initHandleRequestHeaders} from './headers';
import {AliCloudOptions} from './serverless';

/**
 * Options for initializing the request function.
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
   * Whether to execute asynchronous requests.
   */
  async?: boolean;
}

/**
 * Request.
 *
 * @param url Request URL.
 * @param initRequestOptions Options for initializing the request function.
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
 * Initialize the request function.
 *
 * @param initRequestOptions Options for initializing the request function.
 */
export const initRequest =
  (initRequestOptions: InitRequestOptions) =>
  (url: string, options?: RequestOptions) =>
    request(url, initRequestOptions, options);
