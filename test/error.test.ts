import * as assert from 'assert'
import { handleError, initHandleServerlessError } from '../src/error'

describe('test/error.test.ts', () => {
  it('Should be the result of a status code 500 response error.', async () => {
    const result = handleError(
      { message: 'Internal service error.' },
      {
        serviceName: 'leaf-x@snowflake',
        functionName: 'snowflake',
        requestId: 'ee8890a1-a134-4bfb-83e5-b296d8bba1a7',
        env: 'PROD'
      }
    )

    assert(typeof result === 'object')
    assert(result.status === 500)
    assert(result.code === 500)
    assert(result.serviceName === 'leaf-x@snowflake')
    assert(result.functionName === 'snowflake')
    assert(result.requestId === 'ee8890a1-a134-4bfb-83e5-b296d8bba1a7')
    assert(result.message === 'Internal service error.')
    assert(result.env === 'PROD')
    assert(Array.isArray(result.apis))
    assert(typeof result.details === 'object')
  })

  it('Should be the result of a status code 422 response error.', async () => {
    const result = handleError(
      {
        status: 422,
        code: 422000,
        apis: [
          {
            serviceName: 'leaf-x@pay',
            functionName: 'pay',
            requestId: 'ee8890a1-a134-4bfb-83e5-b296d8bba1a8',
            env: 'PROD'
          }
        ]
      },
      {
        serviceName: 'leaf-x@snowflake',
        functionName: 'snowflake',
        requestId: 'ee8890a1-a134-4bfb-83e5-b296d8bba1a7',
        env: 'PROD'
      }
    )

    assert(typeof result === 'object')
    assert(result.status === 422)
    assert(result.code === 422000)
    assert(result.serviceName === 'leaf-x@snowflake')
    assert(result.functionName === 'snowflake')
    assert(result.requestId === 'ee8890a1-a134-4bfb-83e5-b296d8bba1a7')
    assert(result.message === 'leaf-x@snowflake snowflake invoke failed.')
    assert(result.env === 'PROD')
    assert(Array.isArray(result.apis))
  })

  it('Should be the result of serverless error.', async () => {
    try {
      initHandleServerlessError({
        serviceName: 'leaf-x@snowflake',
        functionName: 'snowflake',
        requestId: 'ee8890a1-a134-4bfb-83e5-b296d8bba1a7',
        env: 'PROD'
      })({
        status: 422,
        code: 422000,
        apis: [
          {
            serviceName: 'leaf-x@pay',
            functionName: 'pay',
            requestId: 'ee8890a1-a134-4bfb-83e5-b296d8bba1a8',
            env: 'PROD'
          }
        ]
      })
    } catch (error) {
      assert(typeof error === 'object')
      assert(error.status === 422)
      assert(error.code === 422000)
      assert(error.serviceName === 'leaf-x@snowflake')
      assert(error.functionName === 'snowflake')
      assert(error.requestId === 'ee8890a1-a134-4bfb-83e5-b296d8bba1a7')
      assert(error.message === 'leaf-x@snowflake snowflake invoke failed.')
      assert(error.env === 'PROD')
      assert(Array.isArray(error.apis))
    }
  })
})
