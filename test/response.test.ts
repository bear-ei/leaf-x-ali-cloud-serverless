import * as assert from 'assert'
import * as sinon from 'sinon'
import * as response from '../src/response'

const { handleResponse, handleAliCloudGatewayResponse } = response

describe('test/response.test.ts', () => {
  it('Should be the result of handleResponse.', async () => {
    const correct = () => {
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

    const aliCloudGateway = () => {
      sinon.stub(response, 'handleAliCloudGatewayResponse').returns({
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

    correct()
    aliCloudGateway()
  })

  it('Should be the result of handleAliCloudGatewayResponse.', async () => {
    const correct = () => {
      const result = handleAliCloudGatewayResponse({
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

    const base64 = () => {
      const result = handleAliCloudGatewayResponse({
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

    const error = () => {
      try {
        handleAliCloudGatewayResponse({
          statusCode: 400,
          body: JSON.stringify({ statusCode: 400, message: 'Bad Request.' }),
          isBase64Encoded: false,
          headers: {
            'content-type': 'application/json'
          }
        })
      } catch (error) {
        assert(typeof error === 'object')
        assert(error.statusCode === 400)
        assert(error.message === 'Bad Request.')
      }
    }

    correct()
    base64()
    error()
  })
})
