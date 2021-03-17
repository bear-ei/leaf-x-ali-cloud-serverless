import {
  ExecInvokeFunction,
  InitInvokeFunction,
  RetryInvokeFunction
} from './interface/invoke'
import { ExecRequestResult } from './interface/request'
import { execRequest } from './request'
import { handleResponse } from './response'

export const initInvoke: InitInvokeFunction = ({
  qualifier,
  endpoint,
  version,
  ...args
}) => async (serviceName, functionName, { async = false, ...invokeArgs }) => {
  const path = `/services/${serviceName}.${qualifier}/functions/${functionName}/invocations`
  const url = `${endpoint}/${version}${path}`
  const result = await execInvoke(3, {
    config: { qualifier, ...args },
    options: { url, serviceName, functionName, async, ...invokeArgs }
  })

  return handleResponse(result)
}

export const execInvoke: ExecInvokeFunction = async (
  retryNumber,
  { config, options }
) => {
  let error!: Record<string, unknown>

  const result = await execRequest(options, config)
    .then((result) => result)
    .catch((err) => (error = err))

  const retryInvoke: RetryInvokeFunction = (retryNumber, error) => {
    const retry =
      retryNumber > 0 && ((error.status as unknown) as number) >= 500

    if (retry) {
      retryNumber--

      return execInvoke(retryNumber, { options, config })
    }

    throw error
  }

  return error ? retryInvoke(retryNumber, error) : (result as ExecRequestResult)
}
