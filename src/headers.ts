import {FetchOptions} from '@leaf-x/fetch';
import * as crypto from 'crypto';
import {HttpMethod} from './event';
import {InitRequestOptions} from './request';
import {handleRequestToken} from './token';

/**
 * Handle request headers options.
 */
export interface HandleRequestHeadersOptions {
  /**
   * Request content.
   */
  content: string | Buffer;

  /**
   * A string to set request's method.
   */
  method: FetchOptions['method'];

  /**
   * Request URL.
   */
  url: string;

  /**
   * Whether to execute asynchronous requests.
   */
  async?: boolean;
}

/**
 * Handle request headers.
 *
 * @param handleRequestHeadersOptions Handle request headers options.
 * @param initRequestOptions Options for initializing the request function.
 */
const handleRequestHeaders = (
  {content, method, url, async}: HandleRequestHeadersOptions,
  {host, accountId, accessSecretKey, accessId}: InitRequestOptions
) => {
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

  const authorization = handleRequestToken({
    accessId,
    accessSecretKey,
    method: method as HttpMethod,
    url,
    headers,
  });

  return {authorization, ...headers};
};

/**
 * Initialize the request handling function.
 *
 * @param initRequestOptions Options for initializing the request function.
 */
export const initHandleRequestHeaders =
  (initRequestOptions: InitRequestOptions) =>
  (options: HandleRequestHeadersOptions) =>
    handleRequestHeaders(options, initRequestOptions);

/**
 * Handle canonical request headers strings.
 *
 * @param prefix Canonical request headers prefix.
 * @param headers Request headers information.
 */
export const handleCanonicalHeadersString = (
  prefix: string,
  headers: Record<string, string>
) =>
  Object.keys(headers)
    .filter(key => key.startsWith(prefix))
    .sort()
    .map(key => `${key}:${headers[key]}`)
    .join('\n');
