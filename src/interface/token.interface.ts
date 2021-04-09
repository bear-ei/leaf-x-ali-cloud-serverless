import { HttpMethod } from './event.interface'

/**
 * Get the options to request a serverless token.
 */
export interface GetTokenOptions {
  /**
   * Ali cloud serverless access id.
   */
  accessId: string

  /**
   * Ali cloud serverless access key.
   */
  accessSecretKey: string

  /**
   * Http request method.
   */
  method: HttpMethod

  /**
   * Url address of the request serverless.
   */
  url: string

  /**
   * Serverless request headers.
   */
  headers: Record<string, string>
}

/**
 * Function to get the request serverless token.
 */
export interface GetTokenFunction {
  (options: GetTokenOptions): string
}

/**
 * Get the options to request serverless signature.
 */
export interface GetSignStringOptions {
  /**
   * Http request method.
   */
  method: HttpMethod

  /**
   * Url address of the request serverless.
   */
  url: string

  /**
   * Serverless request headers.
   */
  headers: Record<string, string>
}

/**
 * Function to get the request serverless signature string.
 */
export interface GetSignStringFunction {
  (options: GetSignStringOptions): string
}

/**
 * Function to get the request serverless signature.
 *
 * @param accessSecretKey   Ali cloud serverless access key.
 * @param signString        Request serverless signature string.
 */
export interface GetSignFunction {
  (accessSecretKey: string): (signString: string) => string
}
