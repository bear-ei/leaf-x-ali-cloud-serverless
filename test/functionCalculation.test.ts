import * as assert from 'assert'
import * as sinon from 'sinon'
import { HandleErrorResult } from 'src/interface/error'
import { InvokeResult } from 'src/interface/invoke'
import { functionCalculation } from '../src/functionCalculation'
import * as invoke from '../src/invoke'
import * as warmUp from '../src/warmUp'

describe('test/functionCalculation.test.ts', () => {
  it('Should be the result of functionCalculation.', async () => {
    const defaultOptions = () => {
      sinon
        .stub(invoke, 'initInvoke')
        .returns(async () => ('' as unknown) as InvokeResult)

      sinon
        .stub(warmUp, 'initWarmUp')
        .returns(
          async () => ('' as unknown) as (InvokeResult | HandleErrorResult)[]
        )

      const result = functionCalculation({
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
          async () => ('' as unknown) as (InvokeResult | HandleErrorResult)[]
        )

      const result = functionCalculation({
        accountId: '1234455',
        accessId: 'MTIzMjEzMTQ1NQ==',
        accessSecretKey: 'MTIzNTg5MA==',
        region: 'cn-shanghai',
        timeout: 3000,
        version: '2016-08-15',
        qualifier: 'PROD',
        internal: false,
        secure: true
      })

      sinon.restore()

      assert(typeof result === 'object')
      assert(typeof result.invoke === 'function')
      assert(typeof result.warmUp === 'function')
    }

    defaultOptions()
    inputOptions()
  })
})
