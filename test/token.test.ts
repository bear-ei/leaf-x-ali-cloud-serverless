import * as assert from 'assert'
import { getToken } from '../src/token'

describe('test/token.test.ts', () => {
  it('Should be the result of getToken.', async () => {
    const result = getToken({
      accessId: '123456',
      accessSecretKey: 'HFINLDHGFRTF1',
      method: 'GET',
      url: 'https://github.com/',
      headers: { 'content-type': 'application/octet-stream; charset=utf-8' }
    })

    assert(typeof result === 'string')
  })
})
