import * as assert from 'assert'
import * as sinon from 'sinon'
import * as response from '../src/response'

const { response: handleResponse, aliCloudGatewayResponse } = response

describe('test/response.test.ts', () => {
  it('Should be the result of response.', async () => {
    const correctResponse = () => {
      const result = handleResponse({
        status: 202,
        data: '',
        headers: { 'x-fc-request-id': 'a663b016-f9dc-5220-a330-4c68e932be82' }
      })

      assert(typeof result === 'object')
      assert(result.status === 202)
      assert(result.data === '')
      assert(typeof result.headers === 'object')
    }

    const aliCloudGatewayResponse = () => {
      sinon.stub(response, 'aliCloudGatewayResponse').returns({
        status: 202,
        data: '',
        headers: { 'x-fc-request-id': 'a663b016-f9dc-5220-a330-4c68e932be82' }
      })

      const result = handleResponse({
        status: 200,
        data: {
          statusCode: 202,
          isBase64Encoded: false,
          headers: {},
          body: ''
        },
        headers: { 'x-fc-request-id': 'a663b016-f9dc-5220-a330-4c68e932be82' }
      })

      sinon.restore()

      assert(typeof result === 'object')
      assert(result.status === 202)
      assert(result.data === '')
      assert(typeof result.headers === 'object')
    }

    correctResponse()
    aliCloudGatewayResponse()
  })

  it('Should be the result of aliCloudGatewayResponse.', async () => {
    const correctResponse = () => {
      const result = aliCloudGatewayResponse({
        statusCode: 200,
        body: JSON.stringify({ message: 'json' }),
        isBase64Encoded: false,
        headers: {
          'content-type': 'application/json'
        }
      })

      assert(typeof result === 'object')
      assert(result.status === 200)
      assert((result.data as Record<string, unknown>).message === 'json')
      assert(typeof result.headers === 'object')
    }

    const base64Response = () => {
      const result = aliCloudGatewayResponse({
        statusCode: 200,
        body: Buffer.from('text').toString('base64'),
        isBase64Encoded: true,
        headers: {
          'content-type': 'application/text'
        }
      })

      assert(typeof result === 'object')
      assert(result.status === 200)
      assert(result.data === 'text')
      assert(typeof result.headers === 'object')
    }

    const errorResponse = () => {
      try {
        aliCloudGatewayResponse({
          statusCode: 400,
          body: JSON.stringify({ message: 'Bad Request.' }),
          isBase64Encoded: false,
          headers: {
            'content-type': 'application/json'
          }
        })
      } catch (error) {
        assert(typeof error === 'object')
        assert(error.status === 400)
        assert(
          (error.data as Record<string, unknown>).message === 'Bad Request.'
        )
        assert(typeof error.headers === 'object')
      }
    }

    correctResponse()
    base64Response()
    errorResponse()
  })
})
