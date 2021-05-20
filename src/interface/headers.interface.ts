import {FetchOptions} from '@leaf-x/fetch';
import {InitRequestOptions} from './request.interface';

/**
 * Get request headers options.
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
   * Request URL.
   */
  url: string;

  /**
   * Whether the request is asynchronous or not.
   */
  async?: boolean;
}

/**
 * Initialize the get request headers.
 *
 * @param options InitRequestOptions
 * @return GetRequestHeaders
 */
export interface InitGetRequestHeaders {
  (options: InitRequestOptions): GetRequestHeaders;
}

/**
 * Get request headers.
 *
 * @param options GetRequestHeadersOptions
 * @return Record<string, string>
 */
export interface GetRequestHeaders {
  (options: GetRequestHeadersOptions): Record<string, string>;
}

/**
 * Prefix options for the canonical request headers.
 */
export interface CanonicalPrefixOptions {
  /**
   * Canonical request header prefix.
   */
  prefix: string;
}

/**
 * Get the canonical request headers string.
 *
 * @param prefix CanonicalPrefixOptions
 * @param headers Record<string, string>
 * @return string
 */
export interface GetCanonicalHeadersString {
  (prefix: CanonicalPrefixOptions, headers: Record<string, string>): string;
}
