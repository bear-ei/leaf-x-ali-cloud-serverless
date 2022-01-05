import {HttpMethod} from './event.interface';

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
