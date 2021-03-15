import * as assert from 'assert'
import * as sinon from 'sinon'
import * as invoke from '../src/invoke'
import * as request from '../src/request'
import * as response from '../src/response'
const { initInvoke, execInvoke } = invoke

describe('test/invoke.test.ts', () => {
  it('Should be the result of initInvoke.', async () => {
    sinon
      .stub(invoke, 'execInvoke')
      .resolves({ status: 202, data: '', headers: {} })

    sinon
      .stub(response, 'handleResponse')
      .returns({ status: 202, data: '', headers: {} })

    const result = await initInvoke({
      qualifier: 'PROD',
      endpoint: 'https://github.com/',
      version: '2016-10-17',
      host: 'github.com',
      accountId: '1235555677',
      accessId: 'aHR0cHM6Ly9naXRodWIuY29tLw==',
      accessSecretKey: 'MTIzNTU1NTY3Nw==',
      timeout: 3000
    })('leaf-x@snowflake', 'snowflake', {
      event: {
        type: 'ALI_ClOUD_GATEWAY',
        data: { queryParameters: { name: 'snowflake' } }
      }
    })

    sinon.restore()

    assert(typeof result === 'object')
    assert(result.status === 202)
    assert(result.data === '')
    assert(typeof result.headers === 'object')
  })

  it('Should be the result of execInvoke.', async () => {
    const correctResponse = async () => {
      sinon
        .stub(request, 'execRequest')
        .resolves({ status: 202, data: '', headers: {} })

      const result = await execInvoke(3, {
        config: {
          qualifier: 'PROD',
          host: 'github.com',
          accessId: 'Z2l0aHViLmNvbQ==',
          accountId: '21355663',
          accessSecretKey: 'MjEzNTU2NjM=',
          timeout: 3000
        },
        options: {
          url: 'https://github.com/',
          serviceName: 'leaf-x@snowflake',
          functionName: 'snowflake',
          event: {
            type: 'ALI_ClOUD_GATEWAY',
            data: { queryParameters: { name: 'snowflake' } }
          }
        }
      })
      sinon.restore()

      assert(typeof result === 'object')
      assert(result.status === 202)
      assert(result.data === '')
      assert(typeof result.headers === 'object')
    }

    const errorResponse = async () => {
      sinon.stub(request, 'execRequest').rejects({
        status: 500,
        message: 'Service internal error.'
      })

      try {
        await execInvoke(3, {
          config: {
            qualifier: 'PROD',
            host: 'github.com',
            accessId: 'Z2l0aHViLmNvbQ==',
            accountId: '21355663',
            accessSecretKey: 'MjEzNTU2NjM=',
            timeout: 3000
          },
          options: {
            url: 'https://github.com/',
            serviceName: 'leaf-x@snowflake',
            functionName: 'snowflake',
            event: {
              type: 'ALI_ClOUD_GATEWAY',
              data: { queryParameters: { name: 'snowflake' } }
            }
          }
        })
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
