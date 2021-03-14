import * as assert from 'assert'
import * as sinon from 'sinon'
import * as headers from '../src/headers'
import * as token from '../src/token'

const { getToken, getSignString, getSign } = token

describe('test/token.test.ts', () => {
  it('Should be the result of getToken.', async () => {
    sinon.stub(token, 'getSignString').returns('sign\n')
    sinon
      .stub(token, 'getSign')
      .returns(() => '27edad507277349711d0d95e97036819')

    const result = getToken({
      accessId: '123456',
      accessSecretKey: 'HFINLDHGFRTF1',
      method: 'GET',
      url: 'https://github.com/',
      headers: { 'content-type': 'application/octet-stream; charset=utf-8' }
    })

    sinon.restore()

    assert(typeof result === 'string')
    assert(result === 'FC 123456:27edad507277349711d0d95e97036819')
  })

  it('Should be the result of getSignString.', async () => {
    sinon
      .stub(headers, 'getCanonicalHeadersString')
      .returns(
        ['x-fc-account-id:1787993', 'x-fc-invocation-type:Async'].join('\n')
      )

    const result = getSignString({
      method: 'GET',
      url: 'https://github.com/',
      headers: {
        'content-type': 'application/octet-stream; charset=utf-8',
        'content-md5': '27edad507277349711d0d95e97036819',
        date: 'Thu, 11 Mar 2021 05:55:31 GMT'
      }
    })

    sinon.restore()

    assert(typeof result === 'string')
    assert(
      result ===
        [
          'GET',
          '27edad507277349711d0d95e97036819',
          'application/octet-stream; charset=utf-8',
          'Thu, 11 Mar 2021 05:55:31 GMT',
          ['x-fc-account-id:1787993', 'x-fc-invocation-type:Async'].join('\n'),
          new URL('https://github.com/').pathname
        ].join('\n')
    )
  })

  it('Should be the result of getSign.', async () => {
    const result = getSign('123456')('sign')

    assert(typeof result === 'string')
  })
})
