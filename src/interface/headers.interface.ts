import {FetchOptions} from '@leaf-x/fetch';
import {InitRequestOptions} from './request.interface';

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
 * Initialize the function that gets the request headers.
 *
 * @param options InitRequestOptions
 * @return GetRequestHeaders
 */
export interface InitGetRequestHeaders {
  (options: InitRequestOptions): GetRequestHeaders;
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
