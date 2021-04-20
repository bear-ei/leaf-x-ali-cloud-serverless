import * as crypto from 'crypto'
import {
  GetCanonicalHeadersString,
  GetRequestHeaders,
  InitSpliceCanonicalHeaders
} from './interface/headers.interface'

const initSpliceCanonicalHeaders: InitSpliceCanonicalHeaders = (headers) => (
  key
) => `${key}:${headers[key]}`

export const getRequestHeaders: GetRequestHeaders = ({
  content,
  host,
  accountId,
  async
}) => ({
  accept: '*/*',
  date: new Date().toUTCString(),
  host,
  'user-agent': `Node.js(${process.version}) OS(${process.platform}/${process.arch})`,
  'x-fc-account-id': accountId,
  'content-type': 'application/json; charset=utf-8',
  'content-length': Buffer.isBuffer(content)
    ? `${content.length}`
    : `${Buffer.from(content).length}`,
  'content-md5': crypto.createHash('md5').update(content).digest('hex'),
  ...(async ? { 'x-fc-invocation-type': 'Async' } : undefined)
})

export const getCanonicalHeadersString: GetCanonicalHeadersString = (
  prefix,
  headers
) => {
  const spliceCanonicalHeaders = initSpliceCanonicalHeaders(headers)

  return Object.keys(headers)
    .filter((key) => key.startsWith(prefix))
    .sort()
    .map(spliceCanonicalHeaders)
    .join('\n')
}
