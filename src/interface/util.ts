import * as crypto from 'crypto'
;('use strict')

/**
 * AliCloud gateway event options.
 */
export interface EventOptions {
  /**
   * http method
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
export interface GetRequestHeaderOptions {
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
  isAsync?: boolean
}

/**
 * Get request headers.
 */
export interface GetRequestHeaderFunction {
  (options: GetRequestHeaderOptions): Record<string, string>
}

/**
 * Get request token options
 */
export interface GetRequestTokenOptions {
  /**
   * Ali cloud access id.
   */
  accessId: string

  /**
   * Ali cloud access Key.
   *
   */
  accessSecretKey: string

  /**
   * http method.
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
export interface GetRequestTokenFunction {
  (options: GetRequestTokenOptions): string
}

/**
 * Request a signature.
 */
export interface GetRequestSignFunction {
  (accessSecretKey: string): (signStr: string) => string
}

/**
 * Get signature string options.
 */
export interface GetSignStrOptions {
  /**
   * http method.
   */
  method: string

  /**
   * Request url.
   */
  url: string

  /**
   * Request Headers.
   */
  headers: Record<string, string>
}

/**
 * Get request signature string.
 */
export interface GetSignStrFunction {
  (options: GetSignStrOptions): string
}

/**
 * Event to buffer.
 */
export interface EventToBufferFunction {
  (options: EventOptions): Buffer
}

/**
 * Get specification request header options.
 */
export interface GetCanonicalHeaderOptions {
  /**
   * Request Headers.
   */
  headers: Record<string, string>

  /**
   * specification  request header prefix.
   */
  prefix: string
}

/**
 * Get specification request headers.
 */
export interface GetCanonicalHeadersFunction {
  (options: GetCanonicalHeaderOptions): string
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
export interface GetHeadersStrFunction {
  (headers: Record<string, string>, key: string): string
}
