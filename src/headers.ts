import {FetchOptions} from '@leaf-x/fetch';
import * as crypto from 'crypto';
import {HttpMethod} from './event';
import {InitRequestOptions} from './request';
import {getRequestToken} from './token';

/**
 * Get options for the request headers.
 */
export interface GetRequestHeadersOptions {
  /**
   * Request body content.
   */
  content: string | Buffer;

  /**
   * HTTP request method.
   */
  method: FetchOptions['method'];

  /**
   * URL of the request.
   */
  url: string;

  /**
   * Whether the request is asynchronous or not.
   */
  async?: boolean;
}

/**
 * Get the request headers.
 *
 * @param options GetRequestHeadersOptions
 * @return Record<string, string>
 */
export interface GetRequestHeaders {
  (options: GetRequestHeadersOptions): Record<string, string>;
}

/**
 * Initialize the function that gets the request headers.
 *
 * @param options InitRequestOptions
 * @return GetRequestHeaders
 */
export interface InitGetRequestHeaders {
  (options: InitRequestOptions): GetRequestHeaders;
}

/**
 * Options to canonical the request headers prefix.
 */
export interface CanonicalPrefixOptions {
  /**
   * Canonical request headers prefix.
   */
  prefix: string;
}

/**
 * Get the canonical request headers string.
 *
 * @param prefix CanonicalPrefixOptions
 * @param headers Request headers.
 * @return string
 */
export interface GetCanonicalHeadersString {
  (prefix: CanonicalPrefixOptions, headers: Record<string, string>): string;
}

export const initGetRequestHeaders: InitGetRequestHeaders =
  ({host, accountId, accessSecretKey, accessId}) =>
  ({content, method, url, async}) => {
    const headers = {
      accept: '*/*',
      date: new Date().toUTCString(),
      host,
      'user-agent': `Node.js(${process.version}) OS(${process.platform}/${process.arch})`,
      'x-fc-account-id': accountId,
      'content-type': 'application/json; charset=utf-8',
      'content-md5': crypto.createHash('md5').update(content).digest('hex'),
      'content-length': Buffer.isBuffer(content)
        ? `${content.length}`
        : `${Buffer.from(content).length}`,
      ...(async ? {'x-fc-invocation-type': 'Async'} : undefined),
    };

    const authorization = getRequestToken({
      accessId,
      accessSecretKey,
      method: method as HttpMethod,
      url,
      headers,
    });

    return {authorization, ...headers};
  };

export const getCanonicalHeadersString: GetCanonicalHeadersString = (
  {prefix},
  headers
) =>
  Object.keys(headers)
    .filter(key => key.startsWith(prefix))
    .sort()
    .map(key => `${key}:${headers[key]}`)
    .join('\n');
