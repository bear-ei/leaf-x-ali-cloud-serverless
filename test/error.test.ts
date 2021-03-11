import * as assert from 'assert'
import * as sinon from 'sinon'
import * as error from '../src/error'

const { handleError, handleRequestError } = error

describe('test/error.test.ts', () => {
  it('Should be the result of handleError.', async () => {
    const result = handleError(
      {
        serviceName: 'test',
        functionName: 'test',
        requestId: 'ee8890a1-a134-4bfb-83e5-b296d8bba1a7',
        env: 'PROD'
      },
      {
        status: 500,
        message: 'Internal service error.'
      }
    )

    assert(typeof result === 'object')
    assert(result.status === 500)
    assert(result.code === 500000)
    assert(result.serviceName === 'test')
    assert(result.functionName === 'test')
    assert(result.requestId === 'ee8890a1-a134-4bfb-83e5-b296d8bba1a7')
    assert(result.message === 'Internal service error.')
    assert(result.env === 'PROD')
    assert(Array.isArray(result.apis))
    assert(typeof result.details === 'object')
  })

  it('Should be the result of handleRequestError.', async () => {
    sinon.stub(error, 'handleError').returns({})

    const result = handleRequestError(
      {
        serviceName: 'test',
        functionName: 'test',
        env: 'PROD',
        requestId: 'ee8890a1-a134-4bfb-83e5-b296d8bba1a7'
      },
      {
        status: 500,
        message: 'Internal service error.'
      }
    )

    // assert(typeof result === 'object')
    // assert(result.status === 500)
    // assert(result.code === 500000)
    // assert(result.serviceName === 'test')
    // assert(result.functionName === 'test')
    // assert(result.requestId === 'ee8890a1-a134-4bfb-83e5-b296d8bba1a7')
    // assert(result.message === 'Internal service error.')
    // assert(result.env === 'PROD')
    // assert(Array.isArray(result.apis))
    // assert(typeof result.details === 'object')
  })
})
