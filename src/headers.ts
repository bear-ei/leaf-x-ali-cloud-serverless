import * as crypto from 'crypto'
import {
  GetCanonicalHeadersStringFunction,
  GetHeadersFunction,
  SpliceHeadersStringFunction
} from './interface/headers'

export const getHeaders: GetHeadersFunction = ({
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

export const getCanonicalHeadersString: GetCanonicalHeadersStringFunction = (
  prefix,
  headers
) => {
  const spliceHeaderString = (((headers) => (key) =>
    `${key}:${headers[key]}`) as SpliceHeadersStringFunction)(headers)

  return Object.keys(headers)
    .filter((key) => key.startsWith(prefix))
    .sort()
    .map(spliceHeaderString)
    .join('\n')
}
