import * as assert from 'assert'
import { request } from '../src/request'

describe('test/request.test.ts', () => {
  it('Should respond to a request with status 200.', async () => {
    const result = await request('https://www.bing.com')

    assert(result.status === 200)
  })
})
