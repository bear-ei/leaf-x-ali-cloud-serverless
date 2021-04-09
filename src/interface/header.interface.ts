/**
 * Get options for serverless request headers.
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
   * Whether to make asynchronous requests.
   */
  async?: boolean
}

/**
 * Function to get serverless request headers.
 */
export interface GetHeaderFunction {
  (options: GetHeaderOptions): Record<string, string>
}

/**
 * Function to get the serverless specification request headers string.
 *
 * @param prefix    Serverless request specification headers prefix.
 * @param headers   Serverless request headers.
 */
export interface GetCanonicalHeaderStringFunction {
  (prefix: string, headers: Record<string, string>): string
}

/**
 * Function for splicing serverless specification request headers string.
 *
 * @param headers   Serverless request headers.
 * @param key       Serverless request headers key.
 */
export interface SpliceCanonicalHeaderStringFunction {
  (headers: Record<string, string>, key: string): string
}
