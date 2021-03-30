/**
 * Get request header options.
 */
export interface GetHeadersOptions {
  /**
   * Request content.
   */
  content: Buffer

  /**
   * Request host.
   */
  host: string

  /**
   * Ali cloud account ID.
   */
  accountId: string

  /**
   * Whether to make asynchronous requests.
   */
  async?: boolean
}

/**
 * Get the request headers.
 */
export interface GetHeadersFunction {
  (options: GetHeadersOptions): Record<string, string>
}

/**
 * Get the canonical request headers string.
 *
 * @param prefix    Request headers prefix..
 * @param headers   Request headers.
 */
export interface GetCanonicalHeadersStringFunction {
  (prefix: string, headers: Record<string, string>): string
}

/**
 * Splice request headers string.
 *
 * @param headers   Request headers.
 * @param key       Request headers key.
 */
export interface SpliceHeadersStringFunction {
  (headers: Record<string, string>, key: string): string
}
