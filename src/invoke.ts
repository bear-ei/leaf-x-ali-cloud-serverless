import { handleServerlessError } from './error'
import { handleEvent } from './event'
import { getRequestHeaders } from './headers'
import {
  ExecInvoke,
  InitInvoke,
  InvokeError,
  RetryInvoke
} from './interface/invoke.interface'
import { request } from './request'
import { response } from './response'
import { getToken } from './token'

const execInvoke: ExecInvoke = (retryNumber, { url, options }) => {
  const retry = retryInvoke(retryNumber, { url, options })

  return request(url, options)
    .then((response) => response)
    .catch(retry)
}

const retryInvoke: RetryInvoke = (retryNumber, { url, options }) => (error) => {
  if (retryNumber > 0) {
    retryNumber--

    return execInvoke(retryNumber, { url, options })
  }

  throw error
}

const invokeError: InvokeError = (options) => (error) => {
  const requestId = (error as Record<string, Record<string, unknown>>).headers[
    'x-fc-request-id'
  ] as string

  return handleServerlessError({ ...options, requestId })(error)
}

export const initInvoke: InitInvoke = ({
  qualifier,
  endpoint,
  version,
  host,
  accountId,
  accessSecretKey,
  accessId,
  timeout
}) => async ({
  serviceName,
  functionName,
  async = false,
  event: triggerEvent
}) => {
  const path = `/services/${serviceName}.${qualifier}/functions/${functionName}/invocations`
  const url = `${endpoint}/${version}${path}`
  const method = 'POST'
  const body = JSON.stringify(handleEvent(triggerEvent))
  const requestHeaders = getRequestHeaders({
    content: body,
    host,
    accountId,
    async
  })

  const authorization = getToken({
    accessId,
    accessSecretKey,
    method,
    url,
    headers: requestHeaders
  })

  const execOptions = {
    url,
    options: {
      method,
      headers: { authorization, ...requestHeaders },
      body,
      timeout
    }
  }

  const error = invokeError({ serviceName, functionName, env: qualifier })
  const result = await execInvoke(3, execOptions).catch(error)

  return response({ type: triggerEvent.type, response: result })
}
