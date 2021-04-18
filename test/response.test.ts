import * as assert from 'assert'
import { response } from '../src/response'

describe('test/response.test.ts', () => {
  it('Should be the result of an asynchronous request response.', async () => {
    const result = response({
      type: 'GATEWAY',
      requestResponse: {
        status: 202,
        data: '',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        statusText: '',
        url: ''
      }
    })

    assert(typeof result === 'object')
    assert(result.status === 202)
    assert(result.data === '')
    assert(typeof result.headers === 'object')
    assert(result.headers['content-type'] === 'application/json; charset=utf-8')
  })

  it('Should be the result of responding to a gateway event.', async () => {
    const result = response({
      type: 'GATEWAY',
      requestResponse: {
        status: 200,
        data: {
          statusCode: 200,
          body: JSON.stringify({ message: 'json' }),
          isBase64Encoded: false,
          headers: {
            'content-type': 'application/json; charset=utf-8'
          }
        },
        headers: { 'content-type': 'application/json; charset=utf-8' },
        statusText: '',
        url: ''
      }
    })

    assert(typeof result === 'object')
    assert(result.status === 200)
    assert((result.data as Record<string, unknown>).message === 'json')
    assert(typeof result.headers === 'object')
  })

  it('Should be the result of a response to a Base64 gateway event.', async () => {
    const result = response({
      type: 'GATEWAY',
      requestResponse: {
        status: 200,
        data: {
          statusCode: 200,
          body: Buffer.from('text').toString('base64'),
          isBase64Encoded: true,
          headers: {
            'content-type': 'application/text'
          }
        },
        headers: { 'content-type': 'application/json; charset=utf-8' },
        statusText: '',
        url: ''
      }
    })

    assert(typeof result === 'object')
    assert(result.status === 200)
    assert(result.data === 'text')
    assert(typeof result.headers === 'object')
  })

  it('Should be the result of responding to a gateway event.', async () => {
    try {
      response({
        type: 'GATEWAY',
        requestResponse: {
          status: 200,
          data: {
            statusCode: 400,
            body: JSON.stringify({ statusCode: 400, message: 'Bad Request.' }),
            isBase64Encoded: false,
            headers: {
              'content-type': 'application/json; charset=utf-8'
            }
          },
          headers: { 'content-type': 'application/json; charset=utf-8' },
          statusText: '',
          url: ''
        }
      })
    } catch (error) {
      assert(typeof error === 'object')
      assert(error.statusCode === 400)
      assert(error.message === 'Bad Request.')
    }
  })
})
