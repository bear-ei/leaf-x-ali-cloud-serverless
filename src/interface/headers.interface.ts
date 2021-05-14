import {FetchOptions} from '@leaf-x/fetch';
import {InitRequestOptions} from './request.interface';

/**
 * Get request headers options.
 */
export interface GetRequestHeadersOptions {
  /**
   * Request content.
   */
  content: string | Buffer;

  method: FetchOptions['method'];

  url: string;

  //   /**
  //    * Request host.
  //    */
  //   host: string;

  //   /**
  //    * Ali cloud account ID.
  //    */
  //   accountId: string;

  /**
   * Whether to perform asynchronous requests.
   */
  async?: boolean;
}

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
 * Canonical headers prefix options.
 */
export interface PrefixOptions {
  /**
   * Canonical headers prefix.
   */
  prefix: string;
}

/**
 * Get the canonical request string.
 *
 * @param prefix     PrefixOptions
 * @param headers    Request headers.
 * @return string
 */
export interface GetCanonicalHeadersString {
  (prefix: PrefixOptions, headers: Record<string, unknown>): string;
}

/**
 * Initialize the splice canonical request headers.
 *
 * @param headers Request headers.
 * @return SpliceCanonicalHeaders
 */
export interface InitSpliceCanonicalHeaders {
  (headers: Record<string, unknown>): SpliceCanonicalHeaders;
}

/**
 * Splice canonical request headers.
 *
 * @param key Canonical request header key.
 * @return string
 */
export interface SpliceCanonicalHeaders {
  (key: string): string;
}
