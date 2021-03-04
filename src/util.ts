import * as crypto from 'crypto'
import { flow } from 'lodash/fp'
import {
  EventToBufferFunction,
  GetCanonicalHeadersFunction,
  GetRequestHeaderFunction,
  GetRequestSignFunction,
  GetRequestTokenFunction,
  GetSignStrFunction,
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

export const getRequestHeaders: GetRequestHeaderFunction = ({
  content,
  host,
  accountId,
  isAsync
}) => ({
  accept: 'application/json',
  date: new Date().toUTCString(),
  host,
  'user-agent': `Node.js(${process.version}) OS(${process.platform}/${process.arch})`,
  'x-fc-account-id': accountId,
  'content-type': 'application/octet-stream; charset=utf-8',
  'content-length': content.length.toString(),
  'content-md5': md5(content),
  ...(isAsync ? { 'x-fc-invocation-type': 'Async' } : undefined)
})

export const getRequestToken: GetRequestTokenFunction = ({
  accessId,
  accessSecretKey,
  ...args
}) =>
  `FC ${accessId}:${flow(getSignStr, getRequestSign(accessSecretKey))(args)}`

export const getSignStr: GetSignStrFunction = ({ method, url, headers }) => {
  const contentMD5 = headers['content-md5']
  const contentType = headers['content-type']
  const date = headers['date']
  const signHeaders = getCanonicalHeaders({ headers, prefix: 'x-fc-' })
  const pathUnescaped = decodeURIComponent(new URL(url).pathname)

  return [
    method,
    contentMD5,
    contentType,
    date,
    signHeaders,
    pathUnescaped
  ].join('\n')
}

export const getRequestSign: GetRequestSignFunction = (accessSecretKey) => (
  signStr
) => {
  const buffer = crypto
    .createHmac('sha256', accessSecretKey)
    .update(signStr, 'utf8')
    .digest()

  return Buffer.from(buffer).toString('base64')
}

export const getCanonicalHeaders: GetCanonicalHeadersFunction = ({
  headers,
  prefix
}) => {
  const joinHeadersStr = ((headers) => (key: string) =>
    `${key}:${headers[key]}`)(headers)

  const getCanonical = (({ headers, prefix }) => (key: string) => {
    const lowerKey = key.toLowerCase()

    return lowerKey.startsWith(prefix) ? { [lowerKey]: headers[key] } : {}
  })({ headers, prefix })

  const canonicalHeaders = (headers: Record<string, string>) =>
    Object.keys(headers)
      .map(getCanonical)
      .reduce((a, b) => Object.assign(a, b), {})

  const canonicalHeadersStr = (headers: Record<string, string>) =>
    Object.keys(headers).sort().map(joinHeadersStr).join('\n')

  return flow(canonicalHeaders, canonicalHeadersStr)(headers)
}

export const md5: MD5Function = (data) =>
  crypto.createHash('md5').update(data).digest('hex').toLocaleUpperCase()
