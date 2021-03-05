import * as assert from 'assert'
import axios from 'axios'
import { isObject } from 'lodash/fp'
import * as sinon from 'sinon'
import {
  HandleErrorResult,
  InvokeOptions,
  InvokeResult,
  RequestOptions
} from 'src/interface'
import * as client from '../src'
import * as util from '../src/util'
;('use strict')

const { fc, invoke, request, handleError, response, warmUp } = client

describe('test/util.test.ts', () => {
  it('Should be the result of fc.', async () => {
    const defaultOptions = () => {
      const result = fc({
        accessId: 'test',
        accountId: 'test',
        accessSecretKey: 'test',
        region: 'shanghai'
      })

      assert(typeof result.invoke === 'function')
      assert(typeof result.warmUp === 'function')
    }

    const inputOptions = () => {
      const result = fc({
        accessId: 'test',
        accountId: 'test',
        accessSecretKey: 'test',
        region: 'shanghai',
        timeout: 3000,
        internal: false,
        secure: true
      })

      assert(typeof result.invoke === 'function')
      assert(typeof result.warmUp === 'function')
    }

    defaultOptions()
    inputOptions()
  })

  it('Should be the result of invoke.', async () => {
    const config = {
      accountId: 'test',
      host: 'test.shanghai.fc.aliyuncs.com',
      timeout: 3000,
      qualifier: 'LATEST',
      version: '2016-08-15',
      endpoint: 'http://test.shanghai.fc.aliyuncs.com',
      accessId: 'test',
      accessSecretKey: 'test'
    }

    const options = ({
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
    } as unknown) as InvokeOptions

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

    const error = {
      status: 500,
      data: 'error',
      headers: { 'content-type': 'application/json; charset=utf-8' }
    }

    const correctResponse = async () => {
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

      sinon.stub(client, 'response').returns(response)

      const result = await invoke(config)(options)

      assert(JSON.stringify(response) === JSON.stringify(result))

      sinon.restore()
    }

    const errorResponse = async () => {
      sinon.stub(client, 'request').rejects(error)

      try {
        await invoke(config)(options)
      } catch (err) {
        assert(JSON.stringify(error) === JSON.stringify(err))
      }

      sinon.restore()
    }

    await correctResponse()
    await errorResponse()
  })

  it('Should be the result of handleError.', async () => {
    const options = {
      serviceName: 'snowflake',
      functionName: 'snowflakeIndex',
      requestId: '6cd98939-314c-4404-befc-d18e3b854ce7'
    }

    const businessError = () => {
      const result = handleError(
        { env: 'DEV', ...options },
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
              env: 'DEV'
            }
          ]
        }
      )

      assert(result.status === 401)
      assert(result.code === 401000)
      assert(result.message === 'Unauthorized')
      assert(result.serviceName === 'snowflake')
      assert(result.functionName === 'snowflakeIndex')
      assert(result.env === 'DEV')
      assert(isObject(result.details))
      assert(Array.isArray(result.apis))
    }

    const serviceError = () => {
      const result = handleError({ env: 'DEV', ...options }, { error: 'error' })

      assert(result.message === 'snowflake snowflakeIndex invoke failed.')
      assert(result.status === 500)
      assert(result.code === 500000)
      assert(result.serviceName === 'snowflake')
      assert(result.functionName === 'snowflakeIndex')
      assert(result.env === 'DEV')
      assert(isObject(result.details))
      assert(Array.isArray(result.apis))
    }

    businessError()
    serviceError()
  })

  it('Should be the result of response.', async () => {
    const correctResponse = () => {
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

      assert(result.status === 200)
      assert(JSON.stringify(result.data) === JSON.stringify({ message: 'ok' }))
      assert(
        JSON.stringify(result.headers) ===
          JSON.stringify({ 'content-type': 'application/json; charset=utf-8' })
      )
    }

    const errorResponse = () => {
      try {
        response({
          status: 400,
          data: {
            statusCode: 400,
            isBase64Encoded: false,
            headers: { 'content-type': 'application/json; charset=utf-8' },
            body: JSON.stringify({
              status: 400,
              code: 400000,
              message: `error.`
            })
          },
          headers: { 'content-type': 'application/json; charset=utf-8' }
        })
      } catch (err) {
        assert(err.status === 400)
        assert(err.code === 400000)
        assert(err.message === 'error.')
      }
    }

    const isGatewayData = () => {
      const result = response({
        status: 200,
        data: {
          statusCode: 200,
          isBase64Encoded: false,
          headers: { 'content-type': 'text/plain; charset=utf-8' },
          body: ''
        },
        headers: { 'content-type': 'text/plain; charset=utf-8' }
      })

      assert(result.status === 200)
      assert(result.data === '')
      assert(
        JSON.stringify(result.headers) ===
          JSON.stringify({ 'content-type': 'text/plain; charset=utf-8' })
      )
    }

    const isAliCloudGatewayJsonData = () => {
      const result = response({
        status: 202,
        data: '',
        headers: { 'content-type': 'application/json; charset=utf-8' }
      })

      assert(result.status === 202)
      assert(result.data === '')
      assert(
        JSON.stringify(result.headers) ===
          JSON.stringify({ 'content-type': 'application/json; charset=utf-8' })
      )
    }

    correctResponse()
    errorResponse()
    isGatewayData()
    isAliCloudGatewayJsonData()
  })

  it('Should be the result of warmUp.', async () => {
    const config = {
      accountId: 'test',
      host: 'test.shanghai.fc.aliyuncs.com',
      timeout: 3000,
      qualifier: 'LATEST',
      version: '2016-08-15',
      endpoint: 'http://test.shanghai.fc.aliyuncs.com',
      accessId: 'test',
      accessSecretKey: 'test'
    }

    const correctResponse = async () => {
      sinon.stub(client, 'invoke').returns(async () => ({
        status: 200,
        data: {
          statusCode: 201,
          isBase64Encoded: false,
          headers: { 'content-type': 'application/json; charset=utf-8' },
          body: JSON.stringify({ message: 'ok' })
        },
        headers: { 'content-type': 'application/json; charset=utf-8' }
      }))

      const result = await warmUp(config)('test', ['test1', 'test2'])

      assert(result.length !== 0)
      assert(
        (result as InvokeResult[])
          .map(({ status }: InvokeResult) => status)
          .toString() === [200, 200].toString()
      )

      sinon.restore()
    }

    const businessErrorResponse = async () => {
      sinon.stub(client, 'invoke').returns(async () => {
        throw {
          status: 400,
          data: {
            statusCode: 400,
            isBase64Encoded: false,
            headers: { 'content-type': 'application/json; charset=utf-8' },
            body: JSON.stringify({ message: 'error' })
          },
          headers: { 'content-type': 'application/json; charset=utf-8' }
        }
      })
      const result = await warmUp(config)('test', ['test1', 'test2'])

      assert(result.length !== 0)
      assert(
        (result as HandleErrorResult[])
          .map(({ status }: HandleErrorResult) => status)
          .toString() === [400, 400].toString()
      )

      sinon.restore()
    }

    await correctResponse()
    await businessErrorResponse()
  })

  it('Should be the result of request.', async () => {
    const config = {
      host: 'test.shanghai.fc.aliyuncs.com',
      accountId: 'test',
      accessId: 'test',
      accessSecretKey: 'test',
      timeout: 3000,
      qualifier: 'LATEST'
    }

    const options = ({
      url: 'http://test.shanghai.fc.aliyuncs.com',
      event: {
        pathParameters: {},
        queryParameters: {},
        httpMethod: 'GET'
      },
      isAsync: false,
      serviceName: 'test',
      functionName: 'test'
    } as unknown) as RequestOptions

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

    const error = {
      status: 500,
      code: 500000,
      serviceName: 'test',
      functionName: 'test',
      requestId: '2ea48872-4f8a-4577-9afc-3b8969e960cd',
      message: 'test test invoke failed.',
      env: 'LATEST',
      apis: [
        {
          serviceName: 'test',
          functionName: 'test',
          requestId: '2ea48872-4f8a-4577-9afc-3b8969e960cd',
          env: 'LATEST'
        }
      ]
    }

    const mock = () => {
      sinon.stub(util, 'eventToBuffer').returns(Buffer.from('test'))
      sinon.stub(util, 'getToken').returns('token')
      sinon
        .stub(util, 'getHeaders')
        .returns({ 'content-type': 'application/json; charset=utf-8' })
    }

    const correctResponse = async () => {
      mock()

      sinon.stub(axios, 'request').resolves(response)

      const result = await request(config, options)

      assert(JSON.stringify(result), JSON.stringify(response))

      sinon.restore()
    }

    const businessError = async () => {
      mock()

      sinon.stub(client, 'handleError').returns(error)
      sinon.stub(axios, 'request').rejects({
        response: {
          status: 500,
          data: {
            statusCode: 500,
            isBase64Encoded: false,
            headers: { 'content-type': 'application/json; charset=utf-8' },
            body: JSON.stringify({ message: 'error' })
          },
          headers: {
            'content-type': 'application/json; charset=utf-8',
            'x-fc-request-id': '2ea48872-4f8a-4577-9afc-3b8969e960cd'
          }
        }
      })

      try {
        await request(config, options)
      } catch (err) {
        assert(JSON.stringify(error) === JSON.stringify(err))
      }

      sinon.restore()
    }

    const serviceError = async () => {
      mock()

      sinon.stub(client, 'handleError').returns(error)
      sinon.stub(axios, 'request').rejects({ code: 400 })

      try {
        await request(config, options)
      } catch (err) {
        assert(JSON.stringify(error) === JSON.stringify(err))
      }

      sinon.restore()
    }

    await correctResponse()
    await businessError()
    await serviceError()
  })
})
