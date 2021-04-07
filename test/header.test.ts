import * as assert from 'assert'
import { getCanonicalHeaderString, getHeaders } from '../src/header'

describe('test/headers.test.ts', () => {
  it('Should be the result of getHeaders.', async () => {
    const syncHeaders = () => {
      const content = Buffer.from(
        JSON.stringify({ data: 'This is a request.' })
      )

      const result = getHeaders({
        content: Buffer.from(JSON.stringify({ data: 'This is a request.' })),
        host: 'https://github.com/',
        accountId: '1787993'
      })

      assert(typeof result === 'object')
      assert(result['accept'] === 'application/json; charset=utf-8')
      assert(typeof result['date'] === 'string')
      assert(result['host'] === 'https://github.com/')
      assert(result['user-agent'].startsWith('Node.js'))
      assert(result['x-fc-account-id'] === '1787993')
      assert(result['content-length'] === content.length.toString())
      assert(result['content-md5'] === 'bf32ca0ebf019d8ba4f95145a5a96865')
      assert(
        result['content-type'] === 'application/octet-stream; charset=utf-8'
      )
    }

    const asyncHeaders = () => {
      const content = Buffer.from(
        JSON.stringify({ data: 'This is a request.' })
      )

      const result = getHeaders({
        content: Buffer.from(JSON.stringify({ data: 'This is a request.' })),
        host: 'https://github.com/',
        accountId: '1787993',
        async: true
      })

      assert(typeof result === 'object')
      assert(result['accept'] === 'application/json; charset=utf-8')
      assert(typeof result['date'] === 'string')
      assert(result['host'] === 'https://github.com/')
      assert(result['user-agent'].startsWith('Node.js'))
      assert(result['x-fc-account-id'] === '1787993')
      assert(result['content-length'] === content.length.toString())
      assert(result['content-md5'] === 'bf32ca0ebf019d8ba4f95145a5a96865')
      assert(result['x-fc-invocation-type'] === 'Async')
      assert(
        result['content-type'] === 'application/octet-stream; charset=utf-8'
      )
    }

    syncHeaders()
    asyncHeaders()
  })

  it('Should be the result of getCanonicalHeaderString.', async () => {
    const result = getCanonicalHeaderString('x-fc-', {
      accept: 'application/json; charset=utf-8',
      date: new Date().toUTCString(),
      host: 'https://github.com/',
      'user-agent': `Node.js/${process.version}`,
      'x-fc-account-id': '1787993',
      'content-type': 'application/octet-stream; charset=utf-8',
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
