import * as crypto from 'crypto';
import {HttpMethod} from './event';
import {getCanonicalHeadersString} from './headers';

/**
 * The options to sign.
 */
export interface SignOptions {
  /**
   * Signature string.
   */
  signString: string;

  /**
   * Secret key.
   */
  secret: string;
}

/**
 * Signature.
 *
 * @param options SignOptions
 * @return string
 */
export interface Sign {
  (options: SignOptions): string;
}

/**
 * The options to get the signature string.
 */
export interface GetSignStringOptions {
  /**
   * HTTP request method.
   */
  method: HttpMethod;

  /**
   * URL of the request.
   */
  url: string;

  /**
   * Request headers.
   */
  headers: Record<string, string>;
}

/**
 * Get the signature string.
 *
 * @param options GetSignStringOptions
 * @return string
 */
export interface GetSignString {
  (options: GetSignStringOptions): string;
}

/**
 * The options to get the request token.
 */
export interface GetRequestTokenOptions {
  /**
   * Ali cloud serverless access ID.
   */
  accessId: string;

  /**
   * Ali cloud serverless access key.
   */
  accessSecretKey: string;

  /**
   * HTTP request method.
   */
  method: HttpMethod;

  /**
   * URL of the request.
   */
  url: string;

  /**
   * Request headers.
   */
  headers: Record<string, string>;
}

/**
 * Get the request token.
 *
 * @param options GetRequestTokenOptions
 * @return string
 */
export interface GetRequestToken {
  (options: GetRequestTokenOptions): string;
}

const sign: Sign = ({secret, signString}) => {
  const buffer = crypto
    .createHmac('sha256', secret)
    .update(signString, 'utf8')
    .digest();

  return Buffer.from(buffer).toString('base64');
};

const getSignString: GetSignString = ({method, url, headers}) => {
  const canonicalHeaderString = getCanonicalHeadersString(
    {prefix: 'x-fc-'},
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

export const getRequestToken: GetRequestToken = ({
  accessId,
  accessSecretKey,
  ...args
}) => {
  const signString = getSignString(args);

  return `FC ${accessId}:${sign({secret: accessSecretKey, signString})}`;
};
