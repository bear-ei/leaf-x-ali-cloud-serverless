import * as assert from 'assert'
import { md5 } from '../../src/util/md5'

describe('test/md5.test.ts', () => {
  it('Should be the result of md5.', async () => {
    const result = md5(JSON.stringify({ data: 'This is an md5 data.' }))

    assert(typeof result === 'string')
  })
})
