/**
 * Get request headers options.
 */
export interface GetHeadersOptions {
  /**
   * Request body buffer.
   */
  content: Buffer

  /**
   * Request host.
   */
  host: string

  /**
   * AliCloud account id.
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
export interface GetHeadersFunction {
  (options: GetHeadersOptions): Record<string, string>
}

/**
 * Get the canonical headers string.
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
  (headers: Record<string, string>): (key: string) => string
}
