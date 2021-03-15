import { HttpMethod } from './event'

/**
 * Get request token options.
 */
export interface getTokenOptions {
  /**
   * AliCloud access id.
   */
  accessId: string

  /**
   * AliCloud access key.
   *
   */
  accessSecretKey: string

  /**
   * Http request method.
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
   * Http request method.
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
 * Get signature string.
 */
export interface GetSignStringFunction {
  (options: GetSignStringOptions): string
}

/**
 * Get the signature.
 *
 * @param accessSecretKey   AliCloud access key.
 * @param signString        Signature string.
 */
export interface GetSignFunction {
  (accessSecretKey: string): (signString: string) => string
}
