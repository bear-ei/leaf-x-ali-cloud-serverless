'use strict'

import * as crypto from 'crypto'

export interface EventOptions {
  httpMethod: string

  isBase64Encoded?: boolean

  queryParameters?: Record<string, unknown>

  pathParameters?: Record<string, string>

  body?: Record<string, unknown>

  headers?: Record<string, string>
}

export interface RequestHeadersOptions {
  content: Buffer

  host: string
  accountId: string
  isAsync: boolean
}

export interface RequestHeadersFunction {
  (options: RequestHeadersOptions): Record<string, string>
}

export interface RequestTokenOptions {
  accessId: string

  accessSecretKey: string

  method: string

  path: string

  headers: Record<string, string>
}

export interface RequestTokenFunction {
  (options: RequestTokenOptions): string
}

export interface GenerateSignFunction {
  (accessSecretKey: string, signStr: string): string
}

export interface SignStrOptions {
  method: string

  path: string

  headers: Record<string, string>
}

export interface SignStrFunction {
  (options: SignStrOptions): string
}

export interface EventToBufferFunction {
  (options: EventOptions): Buffer
}

export interface CanonicalHeadersOptions {
  headers: Record<string, string>

  prefix: string
}

export interface CanonicalHeadersFunction {
  (options: CanonicalHeadersOptions): string
}

export interface MD5Function {
  (options: crypto.BinaryLike): string
}

export interface HandleErrorOptions {
  serviceName: string

  functionName: string

  requestId: string

  env: string

  retry?: number
}

export interface HandleErrorResults extends HandleErrorOptions {
  status: number

  code: number

  message: string

  apis?: HandleErrorOptions[]

  details?: unknown
}

export interface HandleErrorFunction {
  (
    options: HandleErrorOptions,
    error: Record<string, unknown>
  ): HandleErrorResults
}
