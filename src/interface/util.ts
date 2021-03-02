'use strict'

import * as crypto from 'crypto'

/**
 * 事件选项
 */
export interface EventOptions {
  /**
   * http 方法
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
   * 是否Base64编码
   */
  isBase64Encoded?: boolean

  /**
   * 查询参数
   */
  queryParameters?: Record<string, unknown>

  /**
   * 路径参数
   */
  pathParameters?: Record<string, string>

  /**
   * 实体
   */
  body?: Record<string, unknown>

  /**
   * 事件请求头
   */
  headers?: Record<string, string>
}

/**
 * 获取请求头选项
 */
export interface GetRequestHeadersOptions {
  /**
   * 请求内容
   */
  content: Buffer

  /**
   * 请求host
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
  (options: GetRequestHeadersOptions): Record<string, string>
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

/**
 * 检查数据类型是否为 Object
 */
export interface IsObjectFunction {
  (data: unknown): boolean
}

/**
 * 排序字符串
 */
export interface SortStrFunction {
  (a: string, b: string): number
}
