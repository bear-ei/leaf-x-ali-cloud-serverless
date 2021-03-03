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
   * 阿里云账号id
   */
  accountId: string

  /**
   * 是否异步调
   */
  isAsync?: boolean
}

/**
 * 获取请求头
 */
export interface GetRequestHeadersFunction {
  (options: GetRequestHeaderOptions): Record<string, string>
}

/**
 * 获取请求token选项
 */
export interface GetRequestTokenOptions {
  /**
   * 阿里云访问id
   */
  accessId: string

  /**
   * 阿里云访问密钥
   *
   */
  accessSecretKey: string

  /**
   * http 方法
   */
  method: string

  /**
   * 请求 url
   */
  url: string

  /**
   * 请求头
   */
  headers: Record<string, string>
}

/**
 * 获取请求token
 */
export interface GetRequestTokenFunction {
  (options: GetRequestTokenOptions): string
}

/**
 * 请求签名
 */
export interface GetRequestSignFunction {
  (accessSecretKey: string): (signStr: string) => string
}

/**
 * 获取签名字符串选项
 */
export interface GetSignStrOptions {
  /**
   * http 方法
   */
  method: string

  /**
   * 请求url
   */
  url: string

  /**
   * 请求头
   */
  headers: Record<string, string>
}

/**
 * 获取请求签名字符串
 */
export interface GetSignStrFunction {
  (options: GetSignStrOptions): string
}

/**
 * 事件转Buffer
 */
export interface EventToBufferFunction {
  (options: EventOptions): Buffer
}

/**
 * 获取规范请求头选项
 */
export interface GetCanonicalHeadersOptions {
  /**
   * 请求头
   */
  headers: Record<string, string>

  /**
   * 规范请求头前缀
   */
  prefix: string
}

/**
 * 获取规范请求头选项
 */
export interface GetCanonicalHeadersFunction {
  (options: GetCanonicalHeadersOptions): string
}

/**
 * md5
 */
export interface MD5Function {
  (options: crypto.BinaryLike): string
}

/**
 * 获取请求头字符串
 */
export interface GetHeadersStrFunction {
  (headers: Record<string, string>, key: string): string
}
