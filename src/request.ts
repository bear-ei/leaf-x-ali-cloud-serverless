import fetch, {FetchOptions, HandleResponseResult} from '@leaf-x/fetch';
import {initGetRequestHeaders} from './headers';
import {AliCloudOptions} from './serverless';

/**
 * Options for initialize request.
 *
 * @extends AliCloudOptions
 */
export interface InitRequestOptions extends AliCloudOptions {
  /**
   * Serverless host.
   */
  host: string;
}

/**
 * The request options.
 *
 * @extends FetchOptions
 */
export interface RequestOptions extends FetchOptions {
  /**
   * Whether to request asynchronously or not.
   */
  async?: boolean;
}

/**
 * Request API.
 *
 * @param url URL of the request.
 * @param options RequestOptions
 * @return Promise<HandleResponseResult>
 */
export interface Request {
  (url: string, options?: RequestOptions): Promise<HandleResponseResult>;
}

/**
 * The function that initialize the request.
 *
 * @param options InitRequestOptions
 * @return Request
 */
export interface InitRequest {
  (options: InitRequestOptions): Request;
}

export const initRequest: InitRequest =
  initRequestOptions =>
  async (url, options = {}) => {
    const {method = 'GET', body = '', timeout, async} = options;
    const headers = initGetRequestHeaders(initRequestOptions)({
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
