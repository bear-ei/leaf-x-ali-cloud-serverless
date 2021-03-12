import {
  ExecInvokeFunction,
  InitInvokeFunction,
  RetryInvokeFunction
} from './interface/invoke'
import { RequestResult } from './interface/request'
import { request } from './request'
import { response } from './response'

export const initInvoke: InitInvokeFunction = ({
  qualifier,
  endpoint,
  version,
  ...args
}) => async (serviceName, functionName, { async = false, ...invokeArgs }) => {
  const path = `/services/${serviceName}.${qualifier}/functions/${functionName}/invocations`
  const url = `${endpoint}/${version}${path}`
  const result = await exec(3, {
    config: { qualifier, ...args },
    options: { url, serviceName, functionName, async, ...invokeArgs }
  })

  return response(result)
}

export const exec: ExecInvokeFunction = async (
  retryNumber,
  { config, options }
) => {
  let error!: Record<string, unknown>

  const result = await request(config, options)
    .then((result) => result)
    .catch((err) => (error = err))

  const retry: RetryInvokeFunction = (retryNumber, error) => {
    const retry =
      retryNumber > 0 && ((error.status as unknown) as number) >= 500

    if (retry) {
      retryNumber--

      return exec(retryNumber, { config, options })
    }

    throw error
  }

  return error ? retry(retryNumber, error) : (result as RequestResult)
}
