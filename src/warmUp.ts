import { ExecWarmUp, InitWarmUp } from './interface/warmUp.interface'
import { initInvoke } from './invoke'

const execWarmUp: ExecWarmUp = ({ serviceName, options }) => {
  const invoke = initInvoke(options)

  return ({ functionName, type }) =>
    invoke({
      serviceName,
      functionName,
      event: {
        type,
        data: { httpMethod: 'OPTIONS', headers: { 'x-warm-up': 'warmUp' } }
      }
    })
      .then((result) =>
        Object.assign({}, result, { serviceName, functionName })
      )
      .catch((error) => error)
}

export const initWarmUp: InitWarmUp = (invokeOptions) => (
  serviceName,
  options
) => {
  const exec = execWarmUp({ serviceName, options: invokeOptions })

  return Promise.all(options.map(exec))
}
