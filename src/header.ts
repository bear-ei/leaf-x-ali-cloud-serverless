import * as crypto from 'crypto'
import { curry } from 'lodash/fp'
import {
  GetCanonicalHeaderStringFunction,
  GetHeaderFunction,
  SpliceHeaderStringFunction
} from './interface/header.interface'

export const getHeaders: GetHeaderFunction = ({
  content,
  host,
  accountId,
  async
}) => ({
  accept: 'application/json; charset=utf-8',
  date: new Date().toUTCString(),
  host,
  'user-agent': `Node.js/${process.version}`,
  'x-fc-account-id': accountId,
  'content-type': 'application/octet-stream; charset=utf-8',
  'content-length': content.length.toString(),
  'content-md5': crypto.createHash('md5').update(content).digest('hex'),
  ...(async ? { 'x-fc-invocation-type': 'Async' } : undefined)
})

export const getCanonicalHeaderString: GetCanonicalHeaderStringFunction = (
  prefix,
  headers
) => {
  const spliceHeaderString = curry(
    ((headers, key) => `${key}:${headers[key]}`) as SpliceHeaderStringFunction
  )(headers)

  return Object.keys(headers)
    .filter((key) => key.startsWith(prefix))
    .sort()
    .map(spliceHeaderString)
    .join('\n')
}
