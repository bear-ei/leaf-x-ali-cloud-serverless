import { HttpMethod } from './event'

/**
 * Get request token options.
 */
export interface getTokenOptions {
  /**
   * Ali cloud serverless access id.
   */
  accessId: string

  /**
   * Ali cloud access key.
   */
  accessSecretKey: string

  /**
   * HTTP request method.
   */
  method: HttpMethod

  /**
   * Request url.
   */
  url: string

  /**
   * Request headers.
   */
  headers: Record<string, string>
}

/**
 * Get the request token.
 */
export interface GetTokenFunction {
  (options: getTokenOptions): string
}

/**
 * Get signature string options.
 */
export interface GetSignStringOptions {
  /**
   * HTTP request method.
   */
  method: HttpMethod

  /**
   * Request url.
   */
  url: string

  /**
   * Request headers.
   */
  headers: Record<string, string>
}

/**
 * Get the signature string.
 */
export interface GetSignStringFunction {
  (options: GetSignStringOptions): string
}

/**
 * Get the signature.
 *
 * @param accessSecretKey Ali cloud access key.
 * @param signString      Signature string.
 */
export interface GetSignFunction {
  (accessSecretKey: string): (signString: string) => string
}
