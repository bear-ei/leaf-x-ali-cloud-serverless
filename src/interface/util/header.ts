/**
 * Get request header options.
 */
export interface GetHeaderOptions {
  /**
   * Request body buffer.
   */
  content: Buffer

  /**
   * Request host.
   */
  host: string

  /**
   * Ali cloud account id.
   */
  accountId: string

  /**
   * If or not the request is asynchronous.
   */
  async?: boolean
}

/**
 * Get request headers.
 */
export interface GetHeaderFunction {
  (options: GetHeaderOptions): Record<string, string>
}

/**
 * Get the canonical header string.
 */
export interface GetCanonicalHeaderStringFunction {
  (prefix: string, headers: Record<string, string>): string
}

/**
 * Splice request header string.
 *
 * @param headers   Request headers.
 * @param key       Request header key.
 */
export interface SpliceHeaderStringFunction {
  (headers: Record<string, string>): (key: string) => string
}
