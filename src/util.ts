'use strict'

import * as crypto from 'crypto'
import { flow } from 'lodash/fp'
import {
  EventToBufferFunction,
  GetCanonicalHeaderStringFunction,
  GetHeaderFunction,
  GetSignFunction,
  GetSignStringFunction,
  GetTokenFunction,
  MD5Function
} from './interface/util'

export const eventToBuffer: EventToBufferFunction = ({
  httpMethod = 'GET',
  isBase64Encoded = false,
  queryParameters = {},
  pathParameters = {},
  body = {},
  headers = {
    'content-type': 'application/json; charset=utf-8',
    accept: 'application/json; charset=utf-8'
  }
}) =>
  flow(
    JSON.stringify,
    Buffer.from
  )({
    httpMethod,
    isBase64Encoded,
    queryParameters,
    pathParameters,
    body: JSON.stringify(body),
    headers
  })

export const getHeaders: GetHeaderFunction = ({
  content,
  host,
  accountId,
  async = false
}) => ({
  accept: 'application/json; charset=utf-8',
  date: new Date().toUTCString(),
  host,
  'user-agent': `Node.js/${process.version}`,
  'x-fc-account-id': accountId,
  'content-type': 'application/octet-stream; charset=utf-8',
  'content-length': content.length.toString(),
  'content-md5': md5(content),
  ...(async ? { 'x-fc-invocation-type': 'Async' } : undefined)
})

export const getToken: GetTokenFunction = ({
  accessId,
  accessSecretKey,
  ...args
}) => `FC ${accessId}:${flow(getSignString, getSign(accessSecretKey))(args)}`

export const getSignString: GetSignStringFunction = ({
  method,
  url,
  headers
}) => {
  const canonicalHeaderString = getCanonicalHeaderString('x-fc-', headers)
  const pathname = decodeURIComponent(new URL(url).pathname)

  return [
    method,
    headers['content-md5'],
    headers['content-type'],
    headers['date'],
    canonicalHeaderString,
    pathname
  ].join('\n')
}

export const getSign: GetSignFunction = (secret) => (signString) => {
  const buffer = crypto
    .createHmac('sha256', secret)
    .update(signString, 'utf8')
    .digest()

  return Buffer.from(buffer).toString('base64')
}

export const getCanonicalHeaderString: GetCanonicalHeaderStringFunction = (
  prefix,
  headers
) => {
  const joinHeaderString = ((headers) => (key: string) =>
    `${key}:${headers[key]}`)(headers)

  return Object.keys(headers)
    .filter((key) => key.startsWith(prefix))
    .sort()
    .map(joinHeaderString)
    .join('\n')
}

export const md5: MD5Function = (data) =>
  crypto.createHash('md5').update(data).digest('hex')
