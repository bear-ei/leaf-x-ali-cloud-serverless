import { ExecWarmUpFunction, InitWarmUpFunction } from './interface/warmUp'
import { initInvoke } from './invoke'

export const initWarmUp: InitWarmUpFunction = (config) => async (
  serviceName,
  functionNames
) => {
  const invoke = initInvoke(config)
  const execWarmUp = (((serviceName) => async ({ functionName, type }) =>
    invoke(serviceName, functionName, {
      event: {
        type,
        data: { httpMethod: 'OPTIONS', headers: { 'x-warm-up': 'warmUp' } }
      }
    }).catch((error) => error)) as ExecWarmUpFunction)(serviceName)

  return Promise.all(functionNames.map(execWarmUp))
}