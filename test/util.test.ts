'use strict'

import * as _ from 'ramda'
import * as sinon from 'sinon'
import * as assert from 'assert'
import {
  eventToBuffer,
  requestHeaders,
  requestToken,
  signStr,
  generateSign,
  canonicalHeaders,
  md5
} from '../src/util'

describe('test/util.test.ts', () => {
  it('Should be the result of eventToBuffer', async () => {
    const result = eventToBuffer({
      httpMethod: 'POST'
    })

    assert(_.is(Buffer, result))
  })

  it('Should be the result of requestHeaders', async () => {
    const obj = {
      md5
    }

    sinon.stub(obj, 'md5').returns('sign')

    const result = requestHeaders({
      content: Buffer.from('test'),
      host: 'test.test-internal.fc.aliyuncs.com',
      accountId: 'test'
    })

    result

    requestHeaders({
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
        'content-md5'
      ])
    )
  })

  it('Should be the result of requestToken', async () => {
    const result = requestToken({
      accessId: 'test',
      accessSecretKey: 'test',
      method: 'POST',
      url: 'https://test.test-internal.fc.aliyuncs.com/test',
      headers: { 'x-fc-token': 'test', 'x-fc-warm-up': 'warmUp' }
    })

    assert(_.is(String, result))
  })

  it('Should be the result of signStr', async () => {
    const result = signStr({
      method: 'POST',
      url: 'https://test.test-internal.fc.aliyuncs.com/test',
      headers: { 'x-fc-token': 'test' }
    })

    assert(_.is(String, result))
  })

  it('Should be the result of generateSign', async () => {
    const result = generateSign('test', 'test')

    assert(_.is(String, result))
  })

  it('Should be the result of canonicalHeaders', async () => {
    const result = canonicalHeaders({
      headers: { 'x-fc-token': 'test', 'x-fc-warm-up': 'warmUp' },
      prefix: 'x-fc'
    })

    canonicalHeaders({
      headers: { 'x-token': 'test' },
      prefix: 'x-fc'
    })

    assert(_.is(String, result))
  })

  it('Should be the result of md5', async () => {
    const result = md5(Buffer.from('test'))

    assert(_.is(String, result))
  })
})
