import * as assert from 'assert'
import * as sinon from 'sinon'
import { HandleErrorResult } from 'src/interface/error'
import { InvokeResult } from 'src/interface/invoke'
import * as invoke from '../src/invoke'
import { initWarmUp } from '../src/warmUp'

describe('test/warmUp.test.ts', () => {
  it('Should be the result of execWarmUp.', async () => {
    const correctResponse = async () => {
      sinon.stub(invoke, 'initInvoke').returns(async () => ({
        data: '',
        status: 200,
        headers: { 'content-type': 'application/json' }
      }))

      const result = await initWarmUp({
        qualifier: 'PROD',
        endpoint: 'https://github.com/',
        version: '2016-10-17',
        host: 'github.com',
        accountId: '1235555677',
        accessId: 'aHR0cHM6Ly9naXRodWIuY29tLw==',
        accessSecretKey: 'MTIzNTU1NTY3Nw==',
        timeout: 3000
      })('leaf-x@snowflake', [
        { type: 'ALI_ClOUD_GATEWAY', functionName: 'snowflake' },
        { type: 'ALI_ClOUD_GATEWAY', functionName: 'snowflakeIndex' }
      ])

      sinon.restore()

      assert(Array.isArray(result))
      assert(
        result.some((result) => {
          const { status, data, headers } = result as InvokeResult

          return status === 200 && data === '' && typeof headers === 'object'
        })
      )
    }

    const errorResponse = async () => {
      sinon.stub(invoke, 'initInvoke').returns(async () => {
        throw {
          code: 4000000,
          status: 400,
          message: 'Bad Request.'
        }
      })

      const result = await initWarmUp({
        qualifier: 'PROD',
        endpoint: 'https://github.com/',
        version: '2016-10-17',
        host: 'github.com',
        accountId: '1235555677',
        accessId: 'aHR0cHM6Ly9naXRodWIuY29tLw==',
        accessSecretKey: 'MTIzNTU1NTY3Nw==',
        timeout: 3000
      })('leaf-x@snowflake', [
        { type: 'ALI_ClOUD_GATEWAY', functionName: 'snowflake' },
        { type: 'ALI_ClOUD_GATEWAY', functionName: 'snowflakeIndex' }
      ])

      sinon.restore()

      assert(Array.isArray(result))
      assert(
        result.some((result) => {
          const { status, code, message } = result as HandleErrorResult

          return (
            status === 400 && code === 4000000 && message === 'Bad Request.'
          )
        })
      )
    }

    await correctResponse()
    await errorResponse()
  })
})
