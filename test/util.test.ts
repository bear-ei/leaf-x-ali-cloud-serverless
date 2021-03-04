'use strict'

import * as sinon from 'sinon'
import * as assert from 'assert'
import * as util from '../src/util'
import { isBuffer } from 'lodash/fp'
const {
  eventToBuffer,
  getRequestHeaders,
  getRequestToken,
  getSignStr,
  getRequestSign,
  getCanonicalHeaders,
  md5
} = util

describe('test/util.test.ts', () => {
  it('Should be the result of eventToBuffer.', async () => {
    const result = eventToBuffer({ httpMethod: 'POST' })

    assert(isBuffer(result))
  })

  it('Should be the result of getRequestHeaders.', async () => {
    sinon.stub(util, 'md5').returns('sign')

    const asyncResult = () => {
      const result = getRequestHeaders({
        content: Buffer.from('test'),
        host: 'test.test-internal.fc.aliyuncs.com',
        accountId: 'test'
      })

      assert(
        Object.keys(result).sort().toString() ===
          [
            'accept',
            'date',
            'host',
            'user-agent',
            'x-fc-account-id',
            'content-type',
            'content-length',
            'content-md5'
          ]
            .sort()
            .toString()
      )
    }

    const syncResult = () => {
      const result = getRequestHeaders({
        content: Buffer.from('test'),
        host: 'test.test-internal.fc.aliyuncs.com',
        accountId: 'test',
        isAsync: true
      })

      assert(
        Object.keys(result).sort().toString() ===
          [
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
            .sort()
            .toString()
      )
    }

    asyncResult()
    syncResult()
  })

  it('Should be the result of getRequestToken.', async () => {
    sinon.stub(util, 'getSignStr').returns('sign')
    sinon.stub(util, 'getRequestSign').returns((sign: string) => sign)

    const result = getRequestToken({
      accessId: 'test',
      accessSecretKey: 'test',
      method: 'POST',
      url: 'https://test.test-internal.fc.aliyuncs.com/test',
      headers: { 'x-fc-token': 'test', 'x-fc-warm-up': 'warmUp' }
    })

    assert(typeof result === 'string')
    assert(result === 'FC test:sign')
  })

  it('Should be the result of getSignStr.', async () => {
    sinon.stub(util, 'getCanonicalHeaders').returns('x-fc-token:test\n')

    const result = getSignStr({
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
  })

  it('Should be the result of getRequestSign.', async () => {
    const result = getRequestSign('test')('test')

    assert(typeof result === 'string')
  })

  it('Should be the result of getCanonicalHeaders.', async () => {
    const result = getCanonicalHeaders({
      headers: {
        'x-fc-token': 'test',
        'x-fc-warm-up': 'warmUp',
        'x-token': 'test'
      },
      prefix: 'x-fc'
    })

    assert(typeof result === 'string')
    assert(result === 'x-fc-token:test\nx-fc-warm-up:warmUp')
  })

  it('Should be the result of md5.', async () => {
    const result = md5(Buffer.from('test'))

    assert(typeof result === 'string')
  })
})
