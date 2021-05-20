import {HttpMethod} from './event.interface';

/**
 * Get request token options.
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
   * Request URL.
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
 * Get signature string options.
 */
export interface GetSignStringOptions {
  /**
   * HTTP request method.
   */
  method: HttpMethod;

  /**
   * Request URL.
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
 * Initialize the signature.
 *
 * @param accessSecretKey Ali cloud serverless access key.
 * @return Sign
 */
export interface InitSign {
  (accessSecretKey: string): Sign;
}

/**
 * Signature.
 *
 * @param signString Signature string.
 * @return string
 */
export interface Sign {
  (signString: string): string;
}
