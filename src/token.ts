import * as crypto from 'crypto';
import {AliCloudOptions} from '.';
import {HttpMethod} from './event';
import {handleCanonicalHeadersString} from './headers';

/**
 *  Signature options.
 */
export interface SignOptions {
  /**
   * Signature string.
   */
  signString: string;

  /**
   * Ali cloud serverless access secret key.
   */
  secret: AliCloudOptions['accessSecretKey'];
}

/**
 * Handle signature string options.
 */
export interface HandleSignStringOptions {
  /**
   * Trigger event HTTP request method.
   */
  method: HttpMethod;

  /**
   * Request URL.
   */
  url: string;

  /**
   * Request header information.
   */
  headers: Record<string, string>;
}

/**
 * Handle token options.
 */
export interface HandleTokenOptions {
  /**
   * Ali cloud serverless access ID.
   */
  accessId: AliCloudOptions['accessId'];

  /**
   * Ali cloud serverless access secret key.
   */
  accessSecretKey: AliCloudOptions['accessSecretKey'];

  /**
   *  Trigger event HTTP request method.
   */
  method: HttpMethod;

  /**
   * Request URL.
   */
  url: string;

  /**
   * Request header information.
   */
  headers: Record<string, string>;
}

/**
 * Generate a request signature.
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
    /** Canonical request header prefix. */ 'x-fc-',
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
 * Handle token.
 *
 * @param options Handle token options.
 */
export const handleToken = ({
  accessId,
  accessSecretKey,
  ...args
}: HandleTokenOptions) => {
  const signString = handleSignString(args);

  return `FC ${accessId}:${sign({secret: accessSecretKey, signString})}`;
};
