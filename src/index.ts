import axios from 'axios'
import { isObject } from 'lodash/fp'
import {
  AliCloudGatewayOptions,
  AliCloudGatewayResponseFunction,
  ExecRequestFunction,
  FCFunction,
  HandleErrorFunction,
  HandleErrorResult,
  HandleRequestErrorFunction,
  InvokeFunction,
  RequestFunction,
  RequestResult,
  ResponseFunction,
  RetryRequestFunction,
  warmUpFunction
} from './interface'
import { eventToBuffer, getHeaders, getToken } from './util'
;('use strict')

export const fc: FCFunction = ({
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

  return { invoke: invoke(config), warmUp: warmUp(config) }
}

export const invoke: InvokeFunction = ({
  qualifier,
  endpoint,
  version,
  ...configArgs
}) => async ({ serviceName, functionName, ...optionsArgs }) => {
  const path = `/services/${serviceName}.${qualifier}/functions/${functionName}/invocations`
  const url = `${endpoint}/${version}${path}`
  const exec: ExecRequestFunction = async (retryNum, { config, options }) => {
    let error!: Record<string, Record<string, unknown>>

    const result = await request(config, options)
      .then((result) => result)
      .catch((err) => (error = err))

    const retry: RetryRequestFunction = (retryNum, error) => {
      const isRetry =
        retryNum > 0 && ((error.status as unknown) as number) >= 500

      if (isRetry) {
        retryNum--

        return exec(retryNum, { config, options })
      }

      throw error
    }

    return error ? retry(retryNum, error) : result
  }

  const result = await exec(3, {
    config: { qualifier, ...configArgs },
    options: { url, serviceName, functionName, ...optionsArgs }
  })

  return response(result)
}

export const handleError: HandleErrorFunction = (
  { serviceName, functionName, requestId, env },
  error
) => {
  const status = (error.status ?? 500) as number
  const code = (error.code ? error.code : Number(`${status}000`)) as number
  const result = !error.status && !error.code ? { details: error } : error
  const currentApis = [{ serviceName, functionName, requestId, env }]
  const message = (error.message ??
    `${serviceName} ${functionName} invoke failed.`) as string

  const apis = Array.isArray(result.apis)
    ? result.apis.concat(currentApis)
    : currentApis

  return Object.assign({}, result, {
    status,
    code,
    serviceName,
    functionName,
    requestId,
    message,
    env,
    apis
  })
}

export const response: ResponseFunction = ({ data, status, ...args }) => {
  const isGatewayData =
    isObject(data) &&
    Object.keys(data).sort().join() ===
      ['statusCode', 'isBase64Encoded', 'headers', 'body'].sort().join()

  const gatewayData: AliCloudGatewayResponseFunction = ({
    statusCode,
    headers,
    body
  }) => {
    const data = headers['content-type'].startsWith('application/json')
      ? JSON.parse(body as string)
      : body

    if (statusCode >= 400) {
      throw data
    }

    return { status: statusCode, headers, data }
  }

  return isGatewayData
    ? gatewayData(data as AliCloudGatewayOptions)
    : { data, status, ...args }
}

export const warmUp: warmUpFunction = (config) => async (
  serviceName,
  functionNames
) => {
  const exec = ((serviceName: string) => async (key: string) =>
    invoke(config)({
      serviceName,
      functionName: key,
      event: { httpMethod: 'OPTIONS', headers: { 'x-warm-up': 'warmUp' } }
    }).catch((error) => error as HandleErrorResult))(serviceName)

  return Promise.all(functionNames.map(exec))
}

export const request: RequestFunction = async (
  { host, accountId, accessId, accessSecretKey, timeout, qualifier },
  { url, event, isAsync, serviceName, functionName }
) => {
  const method = 'POST'
  const buffer = eventToBuffer(event)
  const headers = getHeaders({
    content: buffer,
    host,
    accountId,
    isAsync
  })

  const token = getToken({
    accessId,
    accessSecretKey,
    method,
    url,
    headers
  })

  const handleRequestError: HandleRequestErrorFunction = (
    { serviceName, functionName, qualifier },
    error
  ) => {
    const responseError = error.response as Record<
      string,
      Record<string, unknown>
    >

    if (responseError) {
      throw handleError(
        {
          serviceName,
          functionName,
          requestId: responseError.headers['x-fc-request-id'] as string,
          env: qualifier
        },
        responseError.data
      )
    }

    throw handleError({ serviceName, functionName, env: qualifier }, error)
  }

  return (axios
    .request({
      url,
      method,
      data: buffer,
      timeout,
      headers: Object.assign({}, headers, { authorization: token })
    })
    .then((result) => result)
    .catch((error) =>
      handleRequestError({ serviceName, functionName, qualifier }, error)
    ) as unknown) as RequestResult
}
