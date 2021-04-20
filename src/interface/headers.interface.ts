/**
 * Get the request headers options.
 */
export interface GetRequestHeadersOptions {
  /**
   * Request content.
   */
  content: string | Buffer

  /**
   * Request host.
   */
  host: string

  /**
   * Ali cloud account ID.
   */
  accountId: string

  /**
   * Whether to make asynchronous request.
   */
  async?: boolean
}

/**
 * Get the request headers.
 *
 * @param options GetRequestHeadersOptions
 * @return Record<string, string>
 */
export interface GetRequestHeaders {
  (options: GetRequestHeadersOptions): Record<string, unknown>
}

/**
 * Get the canonical headers string.
 *
 * @param prefix    Canonical headers prefix.
 * @param headers   Request headers.
 * @return string
 */
export interface GetCanonicalHeadersString {
  (prefix: string, headers: Record<string, unknown>): string
}

/**
 * Initialization splice canonical headers.
 *
 * @param headers Request headers.
 * @return SpliceCanonicalHeaders
 */
export interface InitSpliceCanonicalHeaders {
  (headers: Record<string, unknown>): SpliceCanonicalHeaders
}

/**
 * Splice canonical headers
 *
 * @param key string
 * @return string
 */
export interface SpliceCanonicalHeaders {
  (key: string): string
}
