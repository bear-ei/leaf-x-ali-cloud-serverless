import * as assert from 'assert'
import { md5 } from '../../src/util/crypto'

describe('test/crypto.test.ts', () => {
  it('Should be the result of md5.', async () => {
    const result = md5('This is an md5 data.')

    assert(typeof result === 'string')
    assert(result === '3370ed2941a7f3297059583537501703')
  })
})
