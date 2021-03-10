import * as assert from 'assert'
import { eventToBuffer } from '../../src/util/eventToBuffer'

describe('test/eventToBuffer.test.ts', () => {
  it('Should be the result of eventToBuffer.', async () => {
    const result = eventToBuffer({})

    assert(Buffer.isBuffer(result))
  })
})
