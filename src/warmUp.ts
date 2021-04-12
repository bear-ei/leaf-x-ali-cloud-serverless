import {
  ExecWarmUpFunction,
  InitWarmUpFunction
} from './interface/warmUp.interface'
import { initInvoke } from './invoke'

export const initWarmUp: InitWarmUpFunction = (config) => async (
  serviceName,
  options
) => {
  const invoke = initInvoke(config)
  const execWarmUp = (((serviceName) => async ({ functionName, type }) =>
    invoke({
      serviceName,
      functionName,
      event: {
        type,
        data: { httpMethod: 'OPTIONS', headers: { 'x-warm-up': 'warmUp' } }
      }
    })
      .then((result) =>
        Object.assign({}, result, {
          serviceName,
          functionName
        })
      )
      .catch((error) => error)) as ExecWarmUpFunction)(serviceName)

  return Promise.all(options.map(execWarmUp))
}
