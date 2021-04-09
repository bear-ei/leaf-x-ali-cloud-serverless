import * as crypto from 'crypto'
import { compose } from 'lodash/fp'
import { getCanonicalHeaderString } from './header'
import {
  GetSignFunction,
  GetSignStringFunction,
  GetTokenFunction
} from './interface/token.interface'

export const getToken: GetTokenFunction = ({
  accessId,
  accessSecretKey,
  ...args
}) => `FC ${accessId}:${compose(getSign(accessSecretKey), getSignString)(args)}`

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
