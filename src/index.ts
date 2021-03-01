'use strict'

import * as _ from 'ramda'
import axios from 'axios'
import { eventToBuffer, requestHeaders, requestToken } from './util'
import {
  FCFunction,
  ErrorDataFunction,
  ErrorDataOptions,
  InvokeFunction,
  RequestFunction,
  ResponseFunction,
  ErrorDataResult,
  WarmUpFunction,
  RequestResult,
  AliCloudGatewayOptions,
  AliCloudGatewayDataFunction,
  RetryRequestFunction,
  HandleRequestErrorFunction,
  ExecRequestFunction
} from './interface'

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

  return { invoke: _.curry(invoke)(config), warmUp: _.curry(warmUp)(config) }
}

export const invoke: InvokeFunction = async (
  { qualifier, endpoint, version, ...configArgs },
  { serviceName, functionName, ...optionsArgs }
) => {
  const path = `/services/${serviceName}.${qualifier}/functions/${functionName}/invocations`
  const url = `${endpoint}/${version}${path}`
  const exec: ExecRequestFunction = async (retryNum, { config, options }) => {
    let error!: Record<string, Record<string, unknown>>

    const result = (await request(config, options)
      .then((result) => result)
      .catch((err) => (error = err))) as RequestResult

    const retry: RetryRequestFunction = (retry, error) => {
      const isRetry = retry > 0 && ((error.status as unknown) as number) >= 500

      if (isRetry) {
        retry--

        return exec(retry, { config, options })
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

export const errorData: ErrorDataFunction = (
  { serviceName, functionName, requestId, env },
  error
) => {
  const status = (error.status as number) ?? 500
  const code = error.code ? (error.code as number) : Number(`${status}000`)
  const isProdEnv = env === 'PROD' || env === 'PRE'
  const result = isProdEnv
    ? { code }
    : !error.status && !error.code
    ? { details: error }
    : error

  const currentApis = [{ serviceName, functionName, requestId, env }]
  const message = (error.message ??
    `${serviceName} ${functionName} invoke failed.`) as string

  const apis = !isProdEnv
    ? result.apis
      ? _.concat(result.apis as ErrorDataOptions[], currentApis)
      : currentApis
    : []

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
  const sort = _.sort((a: string, b: string) => a.localeCompare(b))
  const isAliCloudGatewayData =
    _.is(Object, data) &&
    _.equals(
      sort(_.keys(data)),
      sort(['statusCode', 'isBase64Encoded', 'headers', 'body'])
    )

  const aliCloudGatewayData: AliCloudGatewayDataFunction = (data) => {
    const { statusCode, headers, body } = _.startsWith(
      'application/json',
      data.headers['content-type']
    )
      ? Object.assign(data, { body: JSON.parse(data.body as string) })
      : data

    if (statusCode >= 400) {
      throw body
    }

    return { status: statusCode, headers, data: body }
  }

  return isAliCloudGatewayData
    ? aliCloudGatewayData(data as AliCloudGatewayOptions)
    : { data, status, ...args }
}

export const warmUp: WarmUpFunction = async (
  config,
  { serviceName, functionNames }
) => {
  const exec = ((serviceName: string) => async (key: string) =>
    invoke(config, {
      serviceName,
      functionName: key,
      event: { httpMethod: 'OPTIONS', headers: { 'x-warm-up': 'warmUp' } }
    }).catch((error: ErrorDataResult) => error))(serviceName)

  return Promise.all(_.map(exec)(functionNames))
}

export const request: RequestFunction = async (
  { host, accountId, accessId, accessSecretKey, timeout, qualifier },
  { url, event, isAsync, serviceName, functionName }
) => {
  const method = 'POST'
  const buffer = eventToBuffer(event)
  const headers = requestHeaders({ content: buffer, host, accountId, isAsync })
  const token = requestToken({
    accessId,
    accessSecretKey,
    method,
    url,
    headers
  })

  const handleError: HandleRequestErrorFunction = (error) => {
    const responseError = error.response as Record<
      string,
      Record<string, unknown>
    >

    if (responseError) {
      throw errorData(
        {
          serviceName,
          functionName,
          requestId: responseError.headers['x-fc-request-id'] as string,
          env: qualifier
        },
        responseError.data
      )
    }

    throw errorData({ serviceName, functionName, env: qualifier }, error)
  }

  return axios
    .request({
      url,
      method,
      data: buffer,
      timeout,
      headers: Object.assign(headers, { authorization: token })
    })
    .then((result) => (result as unknown) as RequestResult)
    .catch((error) => handleError(error))
}
