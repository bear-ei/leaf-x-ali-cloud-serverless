import * as crypto from 'crypto'
import { flow } from 'lodash/fp'
import { getCanonicalHeadersString } from './headers'
import {
  GetSignFunction,
  GetSignStringFunction,
  GetTokenFunction
} from './interface/token'

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
  const canonicalHeaderString = getCanonicalHeadersString('x-fc-', headers)
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
