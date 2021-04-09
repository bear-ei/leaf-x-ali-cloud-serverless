/**
 * Get the options to invoke the serverless request headers.
 */
export interface GetHeaderOptions {
  /**
   * Buffer of the request content.
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
   * Whether to make asynchronous invoke.
   */
  async?: boolean
}

/**
 * Get the function to invoke the serverless request header.
 */
export interface GetHeaderFunction {
  (options: GetHeaderOptions): Record<string, string>
}

/**
 * Get the function to invoke the serverless specification request header
 * string.
 *
 * @param prefix Serverless canonical header prefix.
 */
export interface GetCanonicalHeaderStringFunction {
  (prefix: string, headers: Record<string, string>): string
}

/**
 * Splice the function that invoke the serverless request header string.
 */
export interface SpliceHeaderStringFunction {
  (headers: Record<string, string>, key: string): string
}
