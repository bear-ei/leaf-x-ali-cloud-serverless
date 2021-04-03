/**
 * Get options for the request header.
 */
export interface GetHeadersOptions {
  /**
   * The length of the request content.
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
   * If or not the current request is an asynchronous request.
   */
  async?: boolean
}

/**
 * The function to get the request headers.
 */
export interface GetHeadersFunction {
  (options: GetHeadersOptions): Record<string, string>
}

/**
 * A function to get the canonical request headers string.
 *
 * @param prefix The prefix of the canonical request headers.
 */
export interface GetCanonicalHeadersStringFunction {
  (prefix: string, headers: Record<string, string>): string
}

/**
 * Function for splicing specification request headers.
 */
export interface SpliceHeadersStringFunction {
  (headers: Record<string, string>, key: string): string
}
