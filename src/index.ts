'use strict'

import axios from 'axios'
import { isObject } from 'lodash/fp'
import {
  AliCloudGatewayOptions,
  FCFunction,
  HandleErrorFunction,
  HandleErrorResult,
  HandleRequestErrorOptions,
  InvokeFunction,
  InvokeResult,
  RequestConfig,
  RequestFunction,
  RequestOptions,
  RequestResult,
  ResponseFunction,
  ResponseResult,
  WarmUpFunction
} from './interface'
import { eventToBuffer, getHeaders, getToken } from './util'

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
  ...args
}) => async (serviceName, functionName, options) => {
  const path = `/services/${serviceName}.${qualifier}/functions/${functionName}/invocations`
  const url = `${endpoint}/${version}${path}`
  const exec = async (
    retryNumber: number,
    { config, options }: { config: RequestConfig; options: RequestOptions }
  ): Promise<RequestResult> => {
    let error!: Record<string, Record<string, unknown>>

    const result = await request(config, options)
      .then((result) => result)
      .catch((err) => (error = err))

    const retry = (
      retryNumber: number,
      error: Record<string, Record<string, unknown>>
    ): Promise<RequestResult> | never => {
      const retry =
        retryNumber > 0 && ((error.status as unknown) as number) >= 500

      if (retry) {
        retryNumber--

        return exec(retryNumber, { config, options })
      }

      throw error
    }

    return error ? retry(retryNumber, error) : result
  }

  const result = await exec(3, {
    config: { qualifier, ...args },
    options: { url, serviceName, functionName, ...options }
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
  const aliCloudGatewayKeys = [
    'statusCode',
    'isBase64Encoded',
    'headers',
    'body'
  ]

  const aliCloudGatewayData =
    isObject(data) &&
    Object.keys(data).sort().join() === aliCloudGatewayKeys.sort().join()

  const gatewayData = ({
    statusCode,
    headers,
    body
  }: AliCloudGatewayOptions): ResponseResult | never => {
    const data = headers['content-type'].startsWith('application/json')
      ? JSON.parse(body as string)
      : body

    if (statusCode >= 400) {
      throw data
    }

    return { status: statusCode, headers, data }
  }

  return aliCloudGatewayData
    ? gatewayData(data as AliCloudGatewayOptions)
    : { data, status, ...args }
}

export const warmUp: WarmUpFunction = (config) => async (
  serviceName,
  functionNames
) => {
  const exec = ((serviceName: string) => async (
    key: string
  ): Promise<HandleErrorResult | InvokeResult> =>
    invoke(config)(serviceName, key, {
      event: { httpMethod: 'OPTIONS', headers: { 'x-warm-up': 'warmUp' } }
    }).catch((error) => error as HandleErrorResult))(serviceName)

  return Promise.all(functionNames.map(exec))
}

export const request: RequestFunction = async (
  { host, accountId, accessId, accessSecretKey, timeout, qualifier },
  { url, event, async, serviceName, functionName }
) => {
  const method = 'POST'
  const buffer = eventToBuffer(event)
  const headers = getHeaders({
    content: buffer,
    host,
    accountId,
    async
  })

  const token = getToken({
    accessId,
    accessSecretKey,
    method,
    url,
    headers
  })

  const handleRequestError = (
    { serviceName, functionName, qualifier }: HandleRequestErrorOptions,
    error: Record<string, Record<string, Record<string, unknown>>>
  ): never => {
    const responseError = error.response

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

  return axios
    .request({
      url,
      method,
      data: buffer,
      timeout,
      headers: Object.assign({}, headers, { authorization: token })
    })
    .then((result) => (result as unknown) as RequestResult)
    .catch((error) =>
      handleRequestError({ serviceName, functionName, qualifier }, error)
    )
}
