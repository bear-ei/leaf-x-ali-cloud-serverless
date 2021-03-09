'use strict'

import * as crypto from 'crypto'

/**
 * Ali cloud Gateway event options.
 */
export interface EventOptions {
  /**
   * Request method, default value GET.
   */
  httpMethod?:
    | 'GET'
    | 'POST'
    | 'DELETE'
    | 'HEAD'
    | 'OPTIONS'
    | 'PUT'
    | 'PATCH'
    | 'PURGE'
    | 'LINK'
    | 'UNLINK'

  /**
   * Whether or not to Base64 encode the data.
   */
  isBase64Encoded?: boolean

  /**
   * Query parameters.
   */
  queryParameters?: Record<string, unknown>

  /**
   * Path parameters.
   */
  pathParameters?: Record<string, string>

  /**
   * Request body.
   */
  body?: Record<string, unknown>

  /**
   * Request header.
   */
  headers?: Record<string, string>
}

/**
 * Get request header options.
 */
export interface GetHeaderOptions {
  /**
   * Request body buffer.
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
   * Whether to execute asynchronous requests.
   */
  async?: boolean
}

/**
 * Get the request header function.
 */
export interface GetHeaderFunction {
  (options: GetHeaderOptions): Record<string, string>
}

/**
 * Get request token options.
 */
export interface getTokenOptions {
  /**
   * Ali cloud access id.
   */
  accessId: string

  /**
   * Ali cloud access key.
   *
   */
  accessSecretKey: string

  /**
   * Request method.
   */
  method: EventOptions['httpMethod']

  /**
   * Request url.
   */
  url: string

  /**
   * Request header.
   */
  headers: Record<string, string>
}

/**
 * Get the request token function.
 */
export interface GetTokenFunction {
  (options: getTokenOptions): string
}

/**
 * Get the request signature function.
 *
 * @param accessSecretKey   Ali cloud access key.
 * @param signString        Signature String.
 */
export interface GetSignFunction {
  (accessSecretKey: string): (signString: string) => string
}

/**
 * Get request signature string options.
 */
export interface GetSignStringOptions {
  /**
   * Request method.
   */
  method: EventOptions['httpMethod']

  /**
   * Request url.
   */
  url: string

  /**
   * Request header.
   */
  headers: Record<string, string>
}

/**
 * Get request signature string function.
 */
export interface GetSignStringFunction {
  (options: GetSignStringOptions): string
}

/**
 * Ali cloud gateway event to Buffer function.
 */
export interface EventToBufferFunction {
  (options: EventOptions): Buffer
}

/**
 * Get the canonical request header string function.
 *
 * @param prefix    Canonical request header prefix.
 * @param headers   Request header.
 */
export interface GetCanonicalHeaderStringFunction {
  (prefix: string, headers: Record<string, string>): string
}

/**
 * Md5 function.
 */
export interface MD5Function {
  (options: crypto.BinaryLike): string
}
