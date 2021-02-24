'use strict'

import { EventOptions } from './util'

export interface FCOptions {
  accountId: string

  accessId: string

  accessSecretKey: string

  region: string

  timeout?: number

  qualifier?: string

  internal?: boolean

  secure?: boolean

  version?: string

  endpoint?: string

  host?: string
}

export interface InvokeOptions {
  serviceName: string

  functionName: string

  event: EventOptions

  headers?: Record<string, string>

  isAsync?: boolean
}

export interface InvokeFunction {
  (a: any, options: InvokeOptions): any
}

export interface RequestOptions {
  url: string
  event: EventOptions
  isAsync: boolean
  path: string
  serviceName: string
  functionName: string
}
