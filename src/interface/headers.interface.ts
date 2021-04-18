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
 */
export interface GetRequestHeaders {
  (options: GetRequestHeadersOptions): Record<string, string>
}

/**
 * Get the canonical headers string.
 *
 * @param prefix    Canonical headers prefix.
 * @param headers   Request headers.
 */
export interface GetCanonicalHeadersString {
  (prefix: string, headers: Record<string, string>): string
}

/**
 * Splice canonical headers.
 *
 * @param headers   Request headers.
 * @param key       Request headers key.
 */
export interface SpliceCanonicalHeaders {
  (headers: Record<string, string>): (key: string) => string
}
