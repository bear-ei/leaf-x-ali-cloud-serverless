import * as assert from 'assert'
import axios from 'axios'
import * as sinon from 'sinon'
import * as event from '../src/event'
import * as headers from '../src/headers'
import { execRequest } from '../src/request'
import * as token from '../src/token'

describe('test/request.test.ts', () => {
  it('Should be the result of execRequest.', async () => {
    const correctResponse = async () => {
      sinon.stub(event, 'handleEventToBuffer').returns(Buffer.from('buffer'))

      sinon
        .stub(headers, 'getHeaders')
        .returns({ 'x-fc-request-id': '7ed5b160-327c-96cb-af46-b3c0757dfc35' })

      sinon
        .stub(token, 'getToken')
        .returns('Y2ZjZmYxZWUzMTM0MDkyOWFhYzBmNDhiMGI3ZjVkYmM=')

      sinon.stub(axios, 'request').resolves({ status: 202, data: '' })

      const result = await execRequest(
        {
          url: 'https://github.com/',
          async: false,
          serviceName: 'leaf-x@snowflake',
          functionName: 'snowflake',
          event: {
            type: 'ALI_ClOUD_GATEWAY',
            data: { queryParameters: { name: 'snowflake' } }
          }
        },
        {
          host: 'github.com',
          accountId: '3546677',
          accessId: 'MzU0NjY3Nw==',
          accessSecretKey: 'NTY3NjcxMjMxMg==',
          timeout: 3000,
          qualifier: 'PROD'
        }
      )

      sinon.restore()

      assert(typeof result === 'object')
      assert(result.status === 202)
      assert(result.data === '')
    }

    const errorResponse = async () => {
      sinon.stub(event, 'handleEventToBuffer').returns(Buffer.from('buffer'))

      sinon
        .stub(headers, 'getHeaders')
        .returns({ 'x-fc-request-id': '7ed5b160-327c-96cb-af46-b3c0757dfc35' })

      sinon
        .stub(token, 'getToken')
        .returns('Y2ZjZmYxZWUzMTM0MDkyOWFhYzBmNDhiMGI3ZjVkYmM=')

      sinon
        .stub(axios, 'request')
        .rejects({ status: 500, message: 'Service internal error.' })

      try {
        await execRequest(
          {
            url: 'https://github.com/',
            async: false,
            serviceName: 'leaf-x@snowflake',
            functionName: 'snowflake',
            event: {
              type: 'ALI_ClOUD_GATEWAY',
              data: { queryParameters: { name: 'snowflake' } }
            }
          },
          {
            host: 'github.com',
            accountId: '3546677',
            accessId: 'MzU0NjY3Nw==',
            accessSecretKey: 'NTY3NjcxMjMxMg==',
            timeout: 3000,
            qualifier: 'PROD'
          }
        )
      } catch (error) {
        sinon.restore()

        assert(typeof error === 'object')
        assert(error.status === 500)
        assert(error.message === 'Service internal error.')
      }
    }

    await correctResponse()
    await errorResponse()
  })
})
