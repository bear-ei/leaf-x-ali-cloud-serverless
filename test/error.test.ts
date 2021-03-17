import * as assert from 'assert'
import * as sinon from 'sinon'
import * as error from '../src/error'

const { handleError, handleRequestError } = error

describe('test/error.test.ts', () => {
  it('Should be the result of handleError.', async () => {
    const serviceError = () => {
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
      assert(result.code === 500000)
      assert(result.serviceName === 'leaf-x@snowflake')
      assert(result.functionName === 'snowflake')
      assert(result.requestId === 'ee8890a1-a134-4bfb-83e5-b296d8bba1a7')
      assert(result.message === 'Internal service error.')
      assert(result.env === 'PROD')
      assert(Array.isArray(result.apis))
      assert(typeof result.details === 'object')
    }

    const businessError = () => {
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
    }

    serviceError()
    businessError()
  })

  it('Should be the result of handleRequestError.', async () => {
    const serviceError = () => {
      sinon.stub(error, 'handleError').returns({
        details: { status: 500, message: 'Internal service error.' },
        status: 500,
        code: 500000,
        serviceName: 'leaf-x@snowflake',
        functionName: 'snowflake',
        requestId: 'ee8890a1-a134-4bfb-83e5-b296d8bba1a7',
        message: 'Internal service error.',
        env: 'PROD',
        apis: [
          {
            serviceName: 'leaf-x@snowflake',
            functionName: 'snowflake',
            requestId: 'ee8890a1-a134-4bfb-83e5-b296d8bba1a7',
            env: 'PROD'
          }
        ]
      })

      try {
        handleRequestError(
          {
            status: 500,
            message: 'Internal service error.'
          },
          {
            serviceName: 'leaf-x@snowflake',
            functionName: 'snowflake',
            env: 'PROD',
            requestId: 'ee8890a1-a134-4bfb-83e5-b296d8bba1a7'
          }
        )
      } catch (error) {
        sinon.restore()

        assert(typeof error === 'object')
        assert(error.status === 500)
        assert(error.code === 500000)
        assert(error.serviceName === 'leaf-x@snowflake')
        assert(error.functionName === 'snowflake')
        assert(error.requestId === 'ee8890a1-a134-4bfb-83e5-b296d8bba1a7')
        assert(error.message === 'Internal service error.')
        assert(error.env === 'PROD')
        assert(Array.isArray(error.apis))
        assert(typeof error.details === 'object')
      }
    }

    const responseError = () => {
      sinon.stub(error, 'handleError').returns({
        details: { status: 400, message: 'Bad Request.' },
        status: 400,
        code: 400000,
        serviceName: 'leaf-x@snowflake',
        functionName: 'snowflake',
        requestId: 'ee8890a1-a134-4bfb-83e5-b296d8bba1a7',
        message: 'Bad Request.',
        env: 'PROD',
        apis: [
          {
            serviceName: 'leaf-x@snowflake',
            functionName: 'snowflake',
            requestId: 'ee8890a1-a134-4bfb-83e5-b296d8bba1a7',
            env: 'PROD'
          }
        ]
      })

      try {
        handleRequestError(
          {
            response: {
              headers: {
                'x-fc-request-id': 'ee8890a1-a134-4bfb-83e5-b296d8bba1a7'
              },
              status: 400,
              message: 'Bad Request.'
            }
          },
          {
            serviceName: 'leaf-x@snowflake',
            functionName: 'snowflake',
            env: 'PROD',
            requestId: 'ee8890a1-a134-4bfb-83e5-b296d8bba1a7'
          }
        )
      } catch (error) {
        sinon.restore()

        assert(typeof error === 'object')
        assert(error.status === 400)
        assert(error.code === 400000)
        assert(error.serviceName === 'leaf-x@snowflake')
        assert(error.functionName === 'snowflake')
        assert(error.requestId === 'ee8890a1-a134-4bfb-83e5-b296d8bba1a7')
        assert(error.message === 'Bad Request.')
        assert(error.env === 'PROD')
        assert(Array.isArray(error.apis))
        assert(typeof error.details === 'object')
      }
    }

    serviceError()
    responseError()
  })
})
