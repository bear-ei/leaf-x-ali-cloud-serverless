import { HandleErrorResult } from './interface/error'
import { ExecWarmUpFunction, InitWarmUpFunction } from './interface/warmUp'
import { initInvoke } from './invoke'

export const initWarmUp: InitWarmUpFunction = (config) => async (
  serviceName,
  functionNames
) => {
  const invoke = initInvoke(config)
  const exec = (((serviceName) => async (functionName) =>
    invoke(serviceName, functionName, {
      event: { httpMethod: 'OPTIONS', headers: { 'x-warm-up': 'warmUp' } }
    }).catch((error) => error as HandleErrorResult)) as ExecWarmUpFunction)(
    serviceName
  )

  return Promise.all(functionNames.map(exec))
}
