'use strict'

import * as _ from 'ramda'
import * as sinon from 'sinon'
import * as assert from 'assert'
import axios from 'axios'
import * as client from '../src'
import * as util from '../src/util'
const { fc, invoke, request, errorData, response, warmUp } = client

describe('test/util.test.ts', () => {
  it('Should be the result of fc.', async () => {
    const result = fc({
      accessId: 'test',
      accountId: 'test',
      accessSecretKey: 'test',
      region: 'shanghai'
    })

    assert(_.is(Object, result.invoke))
    assert(_.is(Object, result.warmUp))
  })

  it('Should be the result of invoke.', async () => {
    sinon.stub(client, 'request').resolves({
      status: 200,
      data: {
        statusCode: 200,
        isBase64Encoded: false,
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ message: 'ok' })
      },
      headers: { 'content-type': 'application/json; charset=utf-8' }
    })

    const response = {
      status: 200,
      data: {
        statusCode: 200,
        isBase64Encoded: false,
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body: { message: 'ok' }
      },
      headers: { 'content-type': 'application/json; charset=utf-8' }
    }

    sinon.stub(client, 'response').returns(response)

    const result = await invoke(
      {
        accountId: 'test',
        host: 'test.shanghai.fc.aliyuncs.com',
        timeout: 3000,
        qualifier: 'LATEST',
        version: '2016-08-15',
        endpoint: 'http://test.shanghai.fc.aliyuncs.com',
        accessId: 'test',
        accessSecretKey: 'test'
      },
      {
        serviceName: 'test',
        functionName: 'test',
        event: {
          httpMethod: 'POST',
          isBase64Encoded: false,
          queryParameters: {},
          pathParameters: {},
          body: {},
          headers: {}
        },
        isAsync: false
      }
    )

    assert(_.equals(response, result))
  })

  it('Should be the result of request.', async () => {
    sinon.stub(util, 'eventToBuffer').returns(Buffer.from('test'))
    sinon.stub(util, 'requestToken').returns('token')
    sinon
      .stub(util, 'requestHeaders')
      .returns({ 'content-type': 'application/json; charset=utf-8' })

    const response = {
      status: 200,
      data: {
        statusCode: 200,
        isBase64Encoded: false,
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ message: 'ok' })
      },
      headers: { 'content-type': 'application/json; charset=utf-8' }
    }

    sinon.stub(axios, 'request').resolves(response)

    const result = await request(
      {
        host: 'test.shanghai.fc.aliyuncs.com',
        accountId: 'test',
        accessId: 'test',
        accessSecretKey: 'test',
        timeout: 3000,
        qualifier: 'LATEST'
      },
      {
        url: 'http://test.shanghai.fc.aliyuncs.com',
        event: {
          pathParameters: {},
          queryParameters: {},
          httpMethod: 'GET'
        },
        isAsync: false,
        serviceName: 'test',
        functionName: 'test'
      }
    )

    assert(_.equals(result, response))
  })

  it('Should be the result of errorData.', async () => {
    const result = errorData(
      {
        serviceName: 'snowflake',
        functionName: 'snowflakeIndex',
        requestId: '6cd98939-314c-4404-befc-d18e3b854ce7',
        env: 'dev'
      },
      {
        status: 401,
        code: 401000,
        message: 'Unauthorized',
        details: { message: '401' },
        apis: [
          {
            serviceName: 'snowflake',
            functionName: 'snowflakeIndex',
            requestId: '6cd98939-314c-4404-befc-d18e3b854ce7',
            env: 'dev'
          }
        ]
      }
    )

    assert(result.status === 401)
    assert(result.code === 401000)
    assert(result.message === 'Unauthorized')
    assert(result.serviceName === 'snowflake')
    assert(result.functionName === 'snowflakeIndex')
    assert(result.env === 'dev')
    assert(_.is(Object, result.details))
  })

  it('Should be the result of response.', async () => {
    const result = response({
      status: 200,
      data: {
        statusCode: 200,
        isBase64Encoded: false,
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ message: 'ok' })
      },
      headers: { 'content-type': 'application/json; charset=utf-8' }
    })

    assert(
      _.equals(result, {
        status: 200,
        data: {
          statusCode: 200,
          isBase64Encoded: false,
          headers: { 'content-type': 'application/json; charset=utf-8' },
          body: { message: 'ok' }
        },
        headers: { 'content-type': 'application/json; charset=utf-8' }
      })
    )
  })

  it('Should be the result of warmUp.', async () => {
    sinon.stub(client, 'invoke').resolves({
      status: 200,
      data: {
        statusCode: 201,
        isBase64Encoded: false,
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ message: 'ok' })
      },
      headers: { 'content-type': 'application/json; charset=utf-8' }
    })

    const result = await warmUp(
      {
        accountId: 'test',
        host: 'test.shanghai.fc.aliyuncs.com',
        timeout: 3000,
        qualifier: 'LATEST',
        version: '2016-08-15',
        endpoint: 'http://test.shanghai.fc.aliyuncs.com',
        accessId: 'test',
        accessSecretKey: 'test'
      },
      { serviceName: 'test', functionNames: ['test1', 'test2'] }
    )

    assert(result)
  })
})
