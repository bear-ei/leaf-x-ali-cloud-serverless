'use strict'

import * as _ from 'ramda'
import * as sinon from 'sinon'
import * as assert from 'assert'
import * as util from '../src/util'
const {
  eventToBuffer,
  requestHeaders,
  requestToken,
  signStr,
  generateSign,
  canonicalHeaders,
  md5
} = util

describe('test/util.test.ts', () => {
  it('Should be the result of eventToBuffer.', async () => {
    const result = eventToBuffer({ httpMethod: 'POST' })

    assert(_.is(Buffer, result))
  })

  it('Should be the result of requestHeaders.', async () => {
    sinon.stub(util, 'md5').returns('sign')

    const asyncResult = requestHeaders({
      content: Buffer.from('test'),
      host: 'test.test-internal.fc.aliyuncs.com',
      accountId: 'test'
    })

    assert(
      _.equals(_.keys(asyncResult), [
        'accept',
        'date',
        'host',
        'user-agent',
        'x-fc-account-id',
        'content-type',
        'content-length',
        'content-md5'
      ])
    )

    const result = requestHeaders({
      content: Buffer.from('test'),
      host: 'test.test-internal.fc.aliyuncs.com',
      accountId: 'test',
      isAsync: true
    })

    assert(
      _.equals(_.keys(result), [
        'accept',
        'date',
        'host',
        'user-agent',
        'x-fc-account-id',
        'content-type',
        'content-length',
        'content-md5',
        'x-fc-invocation-type'
      ])
    )
  })

  it('Should be the result of requestToken.', async () => {
    sinon.stub(util, 'generateSign').returns('sign')

    const result = requestToken({
      accessId: 'test',
      accessSecretKey: 'test',
      method: 'POST',
      url: 'https://test.test-internal.fc.aliyuncs.com/test',
      headers: { 'x-fc-token': 'test', 'x-fc-warm-up': 'warmUp' }
    })

    assert(_.is(String, result))
    assert(result === 'FC test:sign')
  })

  it('Should be the result of signStr.', async () => {
    sinon.stub(util, 'canonicalHeaders').returns('x-fc-token:test\n')

    const result = signStr({
      method: 'POST',
      url: 'https://test.test-internal.fc.aliyuncs.com/test',
      headers: {
        'x-fc-token': 'test',
        'content-md5': 'md5',
        'content-type': 'application/json; charset=utf-8',
        date: 'Fri, 26 Feb 2021 03:01:43 GMT'
      }
    })

    assert(_.is(String, result))
    assert(
      result ===
        'POST\nmd5\napplication/json; charset=utf-8\nFri, 26 Feb 2021 03:01:43 GMT\nx-fc-token:test\n\n/test'
    )
  })

  it('Should be the result of generateSign.', async () => {
    const result = generateSign('test', 'test')

    assert(_.is(String, result))
  })

  it('Should be the result of canonicalHeaders.', async () => {
    const result = canonicalHeaders({
      headers: {
        'x-fc-token': 'test',
        'x-fc-warm-up': 'warmUp',
        'x-token': 'test'
      },
      prefix: 'x-fc'
    })

    assert(_.is(String, result))
    assert(result === 'x-fc-token:test\nx-fc-warm-up:warmUp\n')
  })

  it('Should be the result of md5.', async () => {
    const result = md5(Buffer.from('test'))

    assert(_.is(String, result))
  })
})
