import * as crypto from 'crypto'
import * as R from 'ramda'
import {
  EventToBufferFunction,
  GetCanonicalHeadersFunction,
  GetRequestHeadersFunction,
  GetRequestSignFunction,
  GetRequestTokenFunction,
  MD5Function,
  GetSignStrFunction,
  SortStrFunction
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
  R.compose(
    Buffer.from,
    JSON.stringify
  )({
    httpMethod,
    isBase64Encoded,
    queryParameters,
    pathParameters,
    body: R.toString(body),
    headers
  })

export const getRequestHeaders: GetRequestHeadersFunction = ({
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
  'content-length': R.toString(content.length),
  'content-md5': md5(content),
  ...(isAsync ? { 'x-fc-invocation-type': 'Async' } : undefined)
})

export const getRequestToken: GetRequestTokenFunction = ({
  accessId,
  accessSecretKey,
  ...args
}) =>
  `FC ${accessId}:${R.compose(
    getRequestSign(accessSecretKey),
    getSignStr
  )(args)}`

export const getSignStr: GetSignStrFunction = ({ method, url, headers }) => {
  const contentMD5 = headers['content-md5']
  const contentType = headers['content-type']
  const date = headers['date']
  const signHeaders = getCanonicalHeaders({ headers, prefix: 'x-fc-' })
  const pathUnescaped = decodeURIComponent(new URL(url).pathname)

  return R.join('\n', [
    method,
    contentMD5,
    contentType,
    date,
    signHeaders,
    pathUnescaped
  ])
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
  const joinHeadersStr = R.curry(
    (headers: Record<string, string>, key: string) => `${key}:${headers[key]}`
  )(headers)

  const getCanonical = R.curry(
    (
      { headers, prefix }: { headers: Record<string, string>; prefix: string },
      key
    ) => {
      const lowerKey = R.toLower(key)

      return R.startsWith(prefix)(lowerKey) ? { [lowerKey]: headers[key] } : {}
    }
  )({ headers, prefix })

  const canonicalHeaders = R.compose(
    R.reduce((a, b) => Object.assign(a, b), {}),
    R.map(getCanonical),
    R.keys
  )

  const canonicalHeadersStr = R.compose(
    R.join('\n'),
    R.map(joinHeadersStr),
    R.sort(sortStr),
    R.keys
  )

  return R.compose(canonicalHeadersStr, canonicalHeaders)(headers)
}

export const md5: MD5Function = (data) =>
  R.toUpper(crypto.createHash('md5').update(data).digest('hex'))

export const sortStr: SortStrFunction = (a, b) => a.localeCompare(b)
