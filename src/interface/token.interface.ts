import { HttpMethod } from './event.interface'

/**
 * Get token options.
 */
export interface GetTokenOptions {
  /**
   * Ali cloud access ID.
   */
  accessId: string

  /**
   * Ali cloud access key.
   */
  accessSecretKey: string

  /**
   * Http request method.
   */
  method: HttpMethod

  /**
   * Request URL address.
   */
  url: string

  /**
   * Request headers.
   */
  headers: Record<string, string>
}

/**
 * Get token.
 */
export interface GetToken {
  (options: GetTokenOptions): string
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
   * Request URL address.
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
export interface GetSignString {
  (options: GetSignStringOptions): string
}

/**
 * Signature.
 *
 * @param accessSecretKey   Ali cloud access key.
 * @param signString        Signature string.
 */
export interface Sign {
  (accessSecretKey: string): (signString: string) => string
}
