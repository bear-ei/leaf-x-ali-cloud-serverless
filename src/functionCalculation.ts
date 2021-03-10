import { FunctionCalculationFunction } from './interface/functionCalculation'
import { initInvoke } from './invoke'
import { initWarmUp } from './warmUp'

export const functionCalculation: FunctionCalculationFunction = ({
  accountId,
  region,
  timeout = 30000,
  version = '2016-08-15',
  qualifier = 'LATEST',
  internal = true,
  secure = false,
  ...args
}) => {
  const protocol = secure ? 'https' : 'http'
  const network = internal ? '-internal' : ''
  const endpoint = `${protocol}://${accountId}.${region}${network}.fc.aliyuncs.com`
  const host = `${accountId}.${region}${network}.fc.aliyuncs.com`
  const config = {
    accountId,
    host,
    timeout,
    qualifier,
    version,
    endpoint,
    ...args
  }

  return { invoke: initInvoke(config), warmUp: initWarmUp(config) }
}
