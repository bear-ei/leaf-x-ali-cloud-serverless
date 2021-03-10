import * as assert from 'assert'
import * as sinon from 'sinon'
import * as token from '../../src/util/token'

const { getToken } = token

describe('test/token.test.ts', () => {
  sinon.stub(token, 'getSignString').returns('sign\n')
  sinon.stub(token, 'getSign').returns(() => '27edad507277349711d0d95e97036819')

  it('Should be the result of md5.', async () => {
    const result = getToken({
      accessId: '123456',
      accessSecretKey: 'HFINLDHGFRTF1',
      method: 'GET',
      url: 'https://github.com/',
      headers: { 'content-type': 'application/octet-stream; charset=utf-8' }
    })

    assert(typeof result === 'string')
    assert(typeof result === 'string')
  })
})
