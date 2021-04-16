import * as assert from 'assert'
import * as sinon from 'sinon'
import { HandleErrorResult } from 'src/interface/error.interface'
import { InvokeResult } from 'src/interface/invoke.interface'
import { WarmUpResult } from 'src/interface/warmUp.interface'
import * as invoke from '../src/invoke'
import { serverless } from '../src/serverless'
import * as warmUp from '../src/warmUp'

describe('test/serverless.test.ts', () => {
  it('Should be the result of serverless.', async () => {
    const defaultOptions = () => {
      sinon
        .stub(invoke, 'initInvoke')
        .returns(async () => ('' as unknown) as InvokeResult)

      sinon
        .stub(warmUp, 'initWarmUp')
        .returns(
          async () => ('' as unknown) as (WarmUpResult | HandleErrorResult)[]
        )

      const result = serverless({
        accountId: '1234455',
        accessId: 'MTIzNDQ1NQ==',
        accessSecretKey: 'MTIzMjEz',
        region: 'cn-shanghai'
      })

      sinon.restore()

      assert(typeof result === 'object')
      assert(typeof result.invoke === 'function')
      assert(typeof result.warmUp === 'function')
    }

    const inputOptions = () => {
      sinon
        .stub(invoke, 'initInvoke')
        .returns(async () => ('' as unknown) as InvokeResult)

      sinon
        .stub(warmUp, 'initWarmUp')
        .returns(
          async () => ('' as unknown) as (WarmUpResult | HandleErrorResult)[]
        )

      const result = serverless({
        accountId: '1234455',
        accessId: 'MTIzMjEzMTQ1NQ==',
        accessSecretKey: 'MTIzNTg5MA==',
        region: 'cn-shanghai',
        timeout: 3000,
        version: '2016-08-15',
        qualifier: 'PROD',
        internal: false,
        secure: false
      })

      sinon.restore()

      assert(typeof result === 'object')
      assert(typeof result.invoke === 'function')
      assert(typeof result.warmUp === 'function')
    }

    defaultOptions()
    inputOptions()
  })

  it('Should be the result of cc.', async () => {
    const { invoke: i } = serverless({
      accountId: '1513153060849486',
      accessId: 'LTAI4Fd5Chf5FFaQBCatShm3',
      accessSecretKey: '24GBZFnD1FL6a6vSpBcxnc2S3tPjDk',
      region: 'cn-shanghai',
      internal: false,
      qualifier: 'DEV'
    })

    const result = await i({
      serviceName: 'ThalloAttendances',
      functionName: 'attendanceIndex',

      event: {
        type: 'ALI_ClOUD_GATEWAY',
        data: {
          httpMethod: 'GET',
          queryParameters: { isCount: false, s: '233' },
          pathParameters: {},
          headers: { 'x-service': 'service' }
        }
      },
      async: false
    })

    console.info(result)
  })
})
