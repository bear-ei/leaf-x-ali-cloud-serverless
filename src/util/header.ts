import {
  GetCanonicalHeaderStringFunction,
  GetHeaderFunction,
  SpliceHeaderStringFunction
} from '../interface/util/header'
import { md5 } from './md5'

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
  'content-md5': md5(content),
  ...(async ? { 'x-fc-invocation-type': 'Async' } : undefined)
})

export const getCanonicalHeaderString: GetCanonicalHeaderStringFunction = (
  prefix,
  headers
) => {
  const spliceHeaderString = (((headers) => (key) =>
    `${key}:${headers[key]}`) as SpliceHeaderStringFunction)(headers)

  return Object.keys(headers)
    .filter((key) => key.startsWith(prefix))
    .sort()
    .map(spliceHeaderString)
    .join('\n')
}
