import * as assert from 'assert'
import * as sinon from 'sinon'
import * as md5 from '../../src/util/crypto'
import { getCanonicalHeaderString, getHeaders } from '../../src/util/header'

describe('test/header.test.ts', () => {
  it('Should be the result of getHeaders.', async () => {
    const syncHeader = () => {
      sinon.stub(md5, 'md5').returns('27edad507277349711d0d95e97036819')

      const content = Buffer.from(
        JSON.stringify({ data: 'This is a request.' })
      )

      const result = getHeaders({
        content: Buffer.from(JSON.stringify({ data: 'This is a request.' })),
        host: 'https://github.com/',
        accountId: '1787993'
      })

      sinon.restore()

      assert(typeof result === 'object')
      assert(result['accept'] === 'application/json; charset=utf-8')
      assert(typeof result['date'] === 'string')
      assert(result['host'] === 'https://github.com/')
      assert(result['user-agent'].startsWith('Node.js'))
      assert(result['x-fc-account-id'] === '1787993')
      assert(result['content-length'] === content.length.toString())
      assert(result['content-md5'] === '27edad507277349711d0d95e97036819')
      assert(
        result['content-type'] === 'application/octet-stream; charset=utf-8'
      )
    }

    const asyncHeader = () => {
      sinon.stub(md5, 'md5').returns('27edad507277349711d0d95e97036819')

      const content = Buffer.from(
        JSON.stringify({ data: 'This is a request.' })
      )

      const result = getHeaders({
        content: Buffer.from(JSON.stringify({ data: 'This is a request.' })),
        host: 'https://github.com/',
        accountId: '1787993',
        async: true
      })

      sinon.restore()

      assert(typeof result === 'object')
      assert(result['accept'] === 'application/json; charset=utf-8')
      assert(typeof result['date'] === 'string')
      assert(result['host'] === 'https://github.com/')
      assert(result['user-agent'].startsWith('Node.js'))
      assert(result['x-fc-account-id'] === '1787993')
      assert(result['content-length'] === content.length.toString())
      assert(result['content-md5'] === '27edad507277349711d0d95e97036819')
      assert(result['x-fc-invocation-type'] === 'Async')
      assert(
        result['content-type'] === 'application/octet-stream; charset=utf-8'
      )
    }

    syncHeader()
    asyncHeader()
  })

  it('Should be the result of getCanonicalHeaderString.', async () => {
    sinon.stub(md5, 'md5').returns('27edad507277349711d0d95e97036819')

    const result = getCanonicalHeaderString('x-fc-', {
      accept: 'application/json; charset=utf-8',
      date: new Date().toUTCString(),
      host: 'https://github.com/',
      'user-agent': `Node.js/${process.version}`,
      'x-fc-account-id': '1787993',
      'content-type': 'application/octet-stream; charset=utf-8',
      'content-length': '255',
      'content-md5': '27edad507277349711d0d95e97036819',
      'x-fc-invocation-type': 'Async'
    })

    sinon.restore()

    assert(typeof result === 'string')
    assert(
      result ===
        ['x-fc-account-id:1787993', 'x-fc-invocation-type:Async'].join('\n')
    )
  })
})
