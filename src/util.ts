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
;('use strict')

export const eventToBuffer: EventToBufferFunction = ({
  httpMethod,
  isBase64Encoded = false,
  queryParameters = {},
  pathParameters = {},
  body = {},
  headers = {}
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
  async
}) => ({
  accept: 'application/json',
  date: new Date().toUTCString(),
  host,
  'user-agent': `Node.js(${process.version}) OS(${process.platform}/${process.arch})`,
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
  const canonicalHeaderStr = getCanonicalHeaderString(headers, 'x-fc-')
  const pathName = decodeURIComponent(new URL(url).pathname)

  return [
    method,
    headers['content-md5'],
    headers['content-type'],
    headers['date'],
    canonicalHeaderStr,
    pathName
  ].join('\n')
}

export const getSign: GetSignFunction = (accessSecretKey) => (signStr) => {
  const buffer = crypto
    .createHmac('sha256', accessSecretKey)
    .update(signStr, 'utf8')
    .digest()

  return Buffer.from(buffer).toString('base64')
}

export const getCanonicalHeaderString: GetCanonicalHeaderStringFunction = (
  headers,
  prefix
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
