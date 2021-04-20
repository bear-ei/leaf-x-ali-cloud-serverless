import * as assert from 'assert'
import { getCanonicalHeadersString, getRequestHeaders } from '../src/headers'

describe('test/headers.test.ts', () => {
  it('Should be the result of a synchronized request headers.', async () => {
    const content = Buffer.from(JSON.stringify({ data: 'This is a request.' }))
    const result = getRequestHeaders({
      content,
      host: 'https://github.com/',
      accountId: '1787993'
    })

    assert(typeof result === 'object')
    assert(result['accept'] === '*/*')
    assert(typeof result['date'] === 'string')
    assert(result['host'] === 'https://github.com/')
    assert((result['user-agent'] as string).startsWith('Node.js'))
    assert(result['x-fc-account-id'] === '1787993')
    assert(result['content-length'] === content.length.toString())
    assert(result['content-md5'] === 'bf32ca0ebf019d8ba4f95145a5a96865')
    assert(result['content-type'] === 'application/json; charset=utf-8')
  })

  it('Should be the result of an asynchronous request headers.', async () => {
    const content = JSON.stringify({ data: 'This is a request.' })
    const result = getRequestHeaders({
      content,
      host: 'https://github.com/',
      accountId: '1787993',
      async: true
    })

    assert(typeof result === 'object')
    assert(result['accept'] === '*/*')
    assert(typeof result['date'] === 'string')
    assert(result['host'] === 'https://github.com/')
    assert((result['user-agent'] as string).startsWith('Node.js'))
    assert(result['x-fc-account-id'] === '1787993')
    assert(result['content-length'] === content.length.toString())
    assert(result['content-md5'] === 'bf32ca0ebf019d8ba4f95145a5a96865')
    assert(result['x-fc-invocation-type'] === 'Async')
    assert(result['content-type'] === 'application/json; charset=utf-8')
  })

  it('Should be the result of getting the canonical request string.', async () => {
    const result = getCanonicalHeadersString('x-fc-', {
      accept: 'application/json; charset=utf-8',
      date: new Date().toUTCString(),
      host: 'https://github.com/',
      'user-agent': `Node.js/${process.version}`,
      'x-fc-account-id': '1787993',
      'content-type': 'application/octet-stream',
      'content-length': '255',
      'content-md5': 'bf32ca0ebf019d8ba4f95145a5a96865',
      'x-fc-invocation-type': 'Async'
    })

    assert(typeof result === 'string')
    assert(
      result ===
        ['x-fc-account-id:1787993', 'x-fc-invocation-type:Async'].join('\n')
    )
  })
})
