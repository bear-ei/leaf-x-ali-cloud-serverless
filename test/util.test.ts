'use strict'

import * as assert from 'assert'
import * as sinon from 'sinon'
import * as util from '../src/util'

const {
  eventToBuffer,
  getHeaders,
  getToken,
  getSignString,
  getSign,
  getCanonicalHeaderString,
  md5
} = util

describe('test/util.test.ts', () => {
  it('Should be the result of eventToBuffer.', async () => {
    const result = eventToBuffer({ httpMethod: 'POST' })

    assert(Buffer.isBuffer(result))
  })

  it('Should be the result of getHeaders.', async () => {
    const syncResult = () => {
      sinon.stub(util, 'md5').returns('sign')

      const result = getHeaders({
        content: Buffer.from('test'),
        host: 'test.test-internal.fc.aliyuncs.com',
        accountId: 'test'
      })

      const keys = [
        'accept',
        'date',
        'host',
        'user-agent',
        'x-fc-account-id',
        'content-type',
        'content-length',
        'content-md5'
      ]

      assert(typeof result === 'object')
      assert(Object.keys(result).sort().toString() === keys.sort().toString())

      sinon.restore()
    }

    const asyncResult = () => {
      sinon.stub(util, 'md5').returns('sign')

      const result = getHeaders({
        content: Buffer.from('test'),
        host: 'test.test-internal.fc.aliyuncs.com',
        accountId: 'test',
        async: true
      })

      const keys = [
        'accept',
        'date',
        'host',
        'user-agent',
        'x-fc-account-id',
        'content-type',
        'content-length',
        'content-md5',
        'x-fc-invocation-type'
      ]

      assert(typeof result === 'object')
      assert(Object.keys(result).sort().toString() === keys.sort().toString())

      sinon.restore()
    }

    asyncResult()
    syncResult()
  })

  it('Should be the result of getToken.', async () => {
    sinon.stub(util, 'getSignString').returns('sign')
    sinon.stub(util, 'getSign').returns((sign: string) => sign)

    const result = getToken({
      accessId: 'test',
      accessSecretKey: 'test',
      method: 'POST',
      url: 'https://test.test-internal.fc.aliyuncs.com/test',
      headers: { 'x-fc-token': 'test', 'x-fc-warm-up': 'warmUp' }
    })

    assert(typeof result === 'string')
    assert(result === 'FC test:sign')

    sinon.restore()
  })

  it('Should be the result of getSignString.', async () => {
    sinon.stub(util, 'getCanonicalHeaderString').returns('x-fc-token:test\n')

    const result = getSignString({
      method: 'POST',
      url: 'https://test.test-internal.fc.aliyuncs.com/test',
      headers: {
        'x-fc-token': 'test',
        'content-md5': 'md5',
        'content-type': 'application/json; charset=utf-8',
        date: 'Fri, 26 Feb 2021 03:01:43 GMT'
      }
    })

    assert(typeof result === 'string')
    assert(
      result ===
        'POST\nmd5\napplication/json; charset=utf-8\nFri, 26 Feb 2021 03:01:43 GMT\nx-fc-token:test\n\n/test'
    )

    sinon.restore()
  })

  it('Should be the result of getSign.', async () => {
    const result = getSign('test')('test')

    assert(typeof result === 'string')
  })

  it('Should be the result of getCanonicalHeaderString.', async () => {
    const result = getCanonicalHeaderString('x-fc', {
      'x-fc-token': 'test',
      'x-fc-warm-up': 'warmUp',
      'x-token': 'test'
    })

    assert(typeof result === 'string')
    assert(result === 'x-fc-token:test\nx-fc-warm-up:warmUp')
  })

  it('Should be the result of md5.', async () => {
    const result = md5(Buffer.from('test'))

    assert(typeof result === 'string')
  })
})
