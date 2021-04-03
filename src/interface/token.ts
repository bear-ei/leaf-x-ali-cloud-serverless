import { HttpMethod } from './event'

/**
 * The options to get the request token.
 */
export interface getTokenOptions {
  /**
   * Ali cloud access id.
   */
  accessId: string

  /**
   * Access key for ali cloud.
   */
  accessSecretKey: string

  /**
   * Http request method.
   */
  method: HttpMethod

  /**
   * Request url address.
   */
  url: string

  /**
   * Request headers.
   */
  headers: Record<string, string>
}

/**
 * The function to get the request token.
 */
export interface GetTokenFunction {
  (options: getTokenOptions): string
}

/**
 * The options to get the signature string.
 */
export interface GetSignStringOptions {
  /**
   * Http request method.
   */
  method: HttpMethod

  /**
   * Request url address.
   */
  url: string

  /**
   * Request headers.
   */
  headers: Record<string, string>
}

/**
 * The function to get the signature string.
 */
export interface GetSignStringFunction {
  (options: GetSignStringOptions): string
}

/**
 * The function to get the signature.
 */
export interface GetSignFunction {
  (accessSecretKey: string): (signString: string) => string
}
