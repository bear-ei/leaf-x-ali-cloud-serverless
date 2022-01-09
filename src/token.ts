import * as crypto from 'crypto';
import {HttpMethod} from './event';
import {handleCanonicalHeadersString} from './headers';

/**
 * Signature options.
 */
export interface SignOptions {
  /**
   * Signature string.
   */
  signString: string;

  /**
   * Serverless secret key.
   */
  secret: string;
}

/**
 * Handle signature string options.
 */
export interface HandleSignStringOptions {
  /**
   * HTTP request method.
   */
  method: HttpMethod;

  /**
   * Request URL.
   */
  url: string;

  /**
   * Request headers information.
   */
  headers: Record<string, string>;
}

/**
 * Handle the request token options.
 */
export interface HandleTokenOptions {
  /**
   * Serverless access ID.
   */
  accessId: string;

  /**
   * Serverless secret key.
   */
  accessSecretKey: string;

  /**
   * HTTP request method.
   */
  method: HttpMethod;

  /**
   * Request URL.
   */
  url: string;

  /**
   * Request headers information.
   */
  headers: Record<string, string>;
}

/**
 * Signature.
 *
 * @param options Signature options.
 */
const sign = ({secret, signString}: SignOptions) => {
  const buffer = crypto
    .createHmac('sha256', secret)
    .update(signString, 'utf8')
    .digest();

  return Buffer.from(buffer).toString('base64');
};

/**
 * Handle signature strings.
 *
 * @param options Handle signature string options.
 */
const handleSignString = ({method, url, headers}: HandleSignStringOptions) => {
  const canonicalHeaderString = handleCanonicalHeadersString(
    /** Canonical request headers prefix. */ 'x-fc-',
    headers
  );

  return [
    method,
    headers['content-md5'],
    headers['content-type'],
    headers['date'],
    canonicalHeaderString,
    encodeURI(new URL(url).pathname),
  ].join('\n');
};

/**
 * Handle the request token.
 *
 * @param options Handle the request token options.
 */
export const handleToken = ({
  accessId,
  accessSecretKey,
  ...args
}: HandleTokenOptions) => {
  const signString = handleSignString(args);

  return `FC ${accessId}:${sign({secret: accessSecretKey, signString})}`;
};
