import * as crypto from 'crypto'
;('use strict')

/**
 * Ali cloud gateway event options.
 */
export interface EventOptions {
  /**
   * Http request method.
   */
  httpMethod:
    | 'GET'
    | 'POST'
    | 'get'
    | 'delete'
    | 'DELETE'
    | 'head'
    | 'HEAD'
    | 'options'
    | 'OPTIONS'
    | 'post'
    | 'put'
    | 'PUT'
    | 'patch'
    | 'PATCH'
    | 'purge'
    | 'PURGE'
    | 'link'
    | 'LINK'
    | 'unlink'
    | 'UNLINK'
    | undefined

  /**
   * Base64 encoding or not.
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
   * Entities.
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
   * Content of request.
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
   * Asynchronous request or not.
   */
  async?: boolean
}

/**
 * Get request headers.
 */
export interface GetHeaderFunction {
  (options: GetHeaderOptions): Record<string, string>
}

/**
 * Get request token options
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
   * Http request method.
   */
  method: string

  /**
   * Request url.
   */
  url: string

  /**
   * Request headers
   */
  headers: Record<string, string>
}

/**
 * Get request token.
 */
export interface GetTokenFunction {
  (options: getTokenOptions): string
}

/**
 * Request a signature.
 */
export interface GetSignFunction {
  (accessSecretKey: string): (signStr: string) => string
}

/**
 * Get signature string options.
 */
export interface GetSignStringOptions {
  /**
   * Http request method.
   */
  method: string

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
 * Get request signature string.
 */
export interface GetSignStringFunction {
  (options: GetSignStringOptions): string
}

/**
 * Event to buffer.
 */
export interface EventToBufferFunction {
  (options: EventOptions): Buffer
}

/**
 * Get the canonical header string.
 * @param headers   Request headers.
 * @param prefix    Canonical request header prefix.
 */
export interface GetCanonicalHeaderStringFunction {
  (headers: Record<string, string>, prefix: string): string
}

/**
 * md5.
 */
export interface MD5Function {
  (options: crypto.BinaryLike): string
}

/**
 * Get request header string.
 */
export interface GetHeadersStringFunction {
  (headers: Record<string, string>, key: string): string
}
