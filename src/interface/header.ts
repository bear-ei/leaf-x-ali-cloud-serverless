/**
 * Gets the request header options.
 */
export interface GetHeaderOptions {
  /**
   * Request content length.
   */
  content: Buffer

  /**
   * Request host address.
   */
  host: string

  /**
   * Ali cloud account id.
   */
  accountId: string

  /**
   * Whether to execute asynchronous requests.
   */
  async?: boolean
}

/**
 * Get the request headers.
 */
export interface GetHeaderFunction {
  (options: GetHeaderOptions): Record<string, string>
}

/**
 * Get the canonical request header string.
 *
 * @param prefix Canonical request header prefix.
 * @param headers request headers.
 */
export interface GetCanonicalHeaderStringFunction {
  (prefix: string, headers: Record<string, string>): string
}

/**
 * Splice the canonical request header string.
 *
 * @param headers request headers.
 * @param key Request header key.
 */
export interface SpliceHeaderStringFunction {
  (headers: Record<string, string>, key: string): string
}
