'use strict'

import * as crypto from 'crypto'

/**
 * Event options.
 */
export interface EventOptions {
  /**
   * Http method.
   *
   */
  httpMethod: string

  /**
   * Whether base64 encoding.
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
   * Body data.
   */
  body?: Record<string, unknown>

  /**
   * Request headers.
   */
  headers?: Record<string, string>
}

/**
 * Request headers options.
 */
export interface RequestHeadersOptions {
  /**
   * Request content.
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
   * Whether to Invoking asynchronously.
   */
  isAsync?: boolean
}

/**
 * Generate request headers.
 */
export interface RequestHeadersFunction {
  (options: RequestHeadersOptions): Record<string, string>
}

/**
 * Request token options.
 */
export interface RequestTokenOptions {
  /**
   * Access id.
   */
  accessId: string

  /**
   * Access Key.
   */
  accessSecretKey: string

  /**
   * Http method.
   */
  method: string

  /**
   * Request url.
   */
  url: string

  /**
   * Response headers.
   */
  headers: Record<string, string>
}

/**
 * Generate request tokens.
 */
export interface RequestTokenFunction {
  (options: RequestTokenOptions): string
}

/**
 * Generating request signatures。
 *
 * @param accessSecretKey Access Key.
 * @param signStr Signature string.
 */
export interface RequestSignFunction {
  (accessSecretKey: string, signStr: string): string
}

/**
 * Signature string options.
 */
export interface SignStrOptions {
  /**
   * Http method.
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
 * Generate signature string.
 */
export interface SignStrFunction {
  (options: SignStrOptions): string
}

/**
 * Request event to buffer.
 */
export interface EventToBufferFunction {
  (options: EventOptions): Buffer
}

/**
 * Canonical headers options.
 */
export interface CanonicalHeadersOptions {
  /**
   * Request headers.
   */
  headers: Record<string, string>

  /**
   * Canonical request headers prefix.
   */
  prefix: string
}

/**
 * Handling canonical request headers.
 */
export interface CanonicalHeadersFunction {
  (options: CanonicalHeadersOptions): string
}

/**
 * Generate MD5 encoding.
 */
export interface MD5Function {
  (options: crypto.BinaryLike): string
}
