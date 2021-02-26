'use strict'

import * as _ from 'ramda'
import {
  CanonicalHeadersFunction,
  EventToBufferFunction,
  RequestSignFunction,
  MD5Function,
  RequestHeadersFunction,
  RequestTokenFunction,
  SignStrFunction,
  HeadersStrFunction,
  FilterCanonicalHeadersFunction
} from './interface/util'
import * as crypto from 'crypto'

export const eventToBuffer: EventToBufferFunction = ({
  httpMethod,
  isBase64Encoded = false,
  queryParameters = {},
  pathParameters = {},
  body = {},
  headers = {}
}) =>
  _.compose(
    Buffer.from,
    JSON.stringify
  )({
    httpMethod,
    isBase64Encoded,
    queryParameters,
    pathParameters,
    body: JSON.stringify(body),
    headers
  })

export const requestHeaders: RequestHeadersFunction = ({
  content,
  host,
  accountId,
  isAsync
}) => ({
  accept: 'application/json',
  date: new Date().toUTCString(),
  host: host as string,
  'user-agent': `Node.js(${process.version}) OS(${process.platform}/${process.arch})`,
  'x-fc-account-id': accountId,
  'content-type': 'application/octet-stream; charset=utf-8',
  'content-length': `${_.toString(content)}`,
  'content-md5': md5(content),
  ...(isAsync ? { 'x-fc-invocation-type': 'Async' } : undefined)
})

export const requestToken: RequestTokenFunction = ({
  accessId,
  accessSecretKey,
  ...args
}) => {
  const sign = _.curry(generateSign)(accessSecretKey)

  return `FC ${accessId}:${_.compose(sign, signStr)(args)}`
}

export const signStr: SignStrFunction = ({ method, url, headers }) => {
  const contentMD5 = headers['content-md5']
  const contentType = headers['content-type']
  const date = headers['date']
  const signHeaders = canonicalHeaders({ headers, prefix: 'x-fc-' })
  const pathUnescaped = decodeURIComponent(new URL(url).pathname)

  return _.join('\n', [
    method,
    contentMD5,
    contentType,
    date,
    signHeaders,
    pathUnescaped
  ])
}

export const generateSign: RequestSignFunction = (accessSecretKey, signStr) => {
  const buffer = crypto
    .createHmac('sha256', accessSecretKey)
    .update(signStr, 'utf8')
    .digest()

  return Buffer.from(buffer).toString('base64')
}

export const canonicalHeaders: CanonicalHeadersFunction = ({
  headers,
  prefix
}) => {
  const headersStr = _.curry(
    ((headers, key) => `${key}:${headers[key]}`) as HeadersStrFunction
  )(headers)

  const canonical = _.curry((({ headers, prefix }, key: string) => {
    const lowerKey = _.toLower(key)

    return _.startsWith(prefix, lowerKey) ? { [lowerKey]: headers[key] } : {}
  }) as FilterCanonicalHeadersFunction)({ headers, prefix })

  const canonicalHeaders = _.compose(
    _.reduce((a, b) => Object.assign(a, b), {}),
    _.map(canonical),
    _.keys
  )

  const canonicalHeadersStr = _.compose(
    _.join('\n'),
    _.map(headersStr),
    _.sort((a, b) => a.localeCompare(b)),
    _.keys
  )

  return `${_.compose(canonicalHeadersStr, canonicalHeaders)(headers)}\n`
}

export const md5: MD5Function = (data) =>
  crypto.createHash('md5').update(data).digest('hex').toUpperCase()
