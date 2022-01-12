import * as crypto from 'crypto';
import {HttpMethod} from './event';
import {InitRequestOptions, RequestOptions} from './request';
import {handleToken} from './token';

/**
 * Handle request header information options.
 */
export interface HandleRequestHeadersOptions {
  /**
   * Request body content.
   */
  content: string | Buffer;

  /**
   * A string to set request's method.
   */
  method: RequestOptions['method'];

  /**
   * Request URL.
   */
  url: string;

  /**
   * Whether the current request is an asynchronous request.
   */
  async?: RequestOptions['async'];
}

/**
 * Handle the request header information.
 *
 * @param options Handle request header information options.
 * @param initRequestOptions Initialize request options.
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

  const authorization = handleToken({
    accessId,
    accessSecretKey,
    method: method as HttpMethod,
    url,
    headers,
  });

  return {authorization, ...headers};
};

/**
 * Initialize the handle request header information.
 *
 * @param initRequestOptions Initialize request options.
 */
export const initHandleRequestHeaders =
  (initRequestOptions: InitRequestOptions) =>
  (options: HandleRequestHeadersOptions) =>
    handleRequestHeaders(options, initRequestOptions);

/**
 * Handles the canonical request header information string.
 *
 * @param prefix Canonical request header prefix.
 * @param headers Request header information.
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
