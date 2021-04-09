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
   * Serverless request header.
   */
  headers: Record<string, string>
}

/**
 * Function to get the request no server token.
 */
export interface GetTokenFunction {
  (options: GetTokenOptions): string
}

/**
 * Get the options to request no server signature.
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
   * Serverless request header.
   */
  headers: Record<string, string>
}

/**
 * Function to get the request without server signature.
 */
export interface GetSignStringFunction {
  (options: GetSignStringOptions): string
}

/**
 * Function to get the signature.
 *
 * @param accessSecretKey   Ali cloud serverless access key.
 * @param signString        Request the signature string of serverless.
 */
export interface GetSignFunction {
  (accessSecretKey: string): (signString: string) => string
}
