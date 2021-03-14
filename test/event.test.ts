import * as assert from 'assert'
import * as sinon from 'sinon'
import * as event from '../src/event'

const { handleEventToBuffer, handleAliCloudGatewayEvent } = event

describe('test/event.test.ts', () => {
  it('Should be the result of handleEventToBuffer.', async () => {
    const correct = () => {
      sinon.stub(event, 'handleAliCloudGatewayEvent').returns(
        JSON.stringify({
          httpMethod: 'GET',
          isBase64Encoded: false,
          queryParameters: {},
          pathParameters: {},
          body: JSON.stringify({}),
          headers: {
            'content-type': 'application/json; charset=utf-8',
            accept: 'application/json; charset=utf-8'
          }
        })
      )

      const result = handleEventToBuffer({
        type: 'ALI_ClOUD_GATEWAY',
        data: {}
      })

      sinon.restore()

      assert(Buffer.isBuffer(result))
    }

    const error = () => {
      sinon.stub(event, 'handleAliCloudGatewayEvent').returns(
        JSON.stringify({
          httpMethod: 'GET',
          isBase64Encoded: false,
          queryParameters: {},
          pathParameters: {},
          body: JSON.stringify({}),
          headers: {
            'content-type': 'application/json; charset=utf-8',
            accept: 'application/json; charset=utf-8'
          }
        })
      )

      try {
        handleEventToBuffer({
          type: 'ALI_ClOUD' as 'ALI_ClOUD_GATEWAY',
          data: {}
        })
      } catch (error) {
        sinon.restore()

        assert(typeof error === 'object')
        assert(error.message === 'Invalid event type.')
      }
    }

    correct()
    error()
  })

  it('Should be the result of handleAliCloudGatewayEvent.', async () => {
    const correct = () => {
      const result = handleAliCloudGatewayEvent({})

      assert(typeof result === 'string')
      assert(
        result ===
          JSON.stringify({
            httpMethod: 'GET',
            isBase64Encoded: false,
            queryParameters: {},
            pathParameters: {},
            body: JSON.stringify({}),
            headers: {
              'content-type': 'application/json; charset=utf-8',
              accept: 'application/json; charset=utf-8'
            }
          })
      )
    }

    const defaultContentType = () => {
      const result = handleAliCloudGatewayEvent({ headers: {} })

      assert(typeof result === 'string')
      assert(
        result ===
          JSON.stringify({
            httpMethod: 'GET',
            isBase64Encoded: false,
            queryParameters: {},
            pathParameters: {},
            body: JSON.stringify({}),
            headers: {
              'content-type': 'application/json; charset=utf-8',
              accept: 'application/json; charset=utf-8'
            }
          })
      )
    }

    const inputContentType = () => {
      const result = handleAliCloudGatewayEvent({
        headers: {
          'content-type': 'application/text; charset=utf-8',
          accept: 'application/text; charset=utf-8'
        },
        body: 'data'
      })

      assert(typeof result === 'string')
      assert(
        result ===
          JSON.stringify({
            httpMethod: 'GET',
            isBase64Encoded: false,
            queryParameters: {},
            pathParameters: {},
            body: 'data',
            headers: {
              'content-type': 'application/text; charset=utf-8',
              accept: 'application/text; charset=utf-8'
            }
          })
      )
    }

    correct()
    defaultContentType()
    inputContentType()
  })
})
