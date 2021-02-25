'use strict'

import * as _ from 'ramda'
import axios, { AxiosResponse } from 'axios'
import { eventToBuffer, requestHeaders, requestToken } from './util'
import {
  FCFunction,
  HandleErrorFunction,
  HandleErrorOptions,
  InvokeFunction,
  RequestConfig,
  RequestFunction,
  RequestOptions,
  ResponseFunction,
  HandleErrorResult,
  WarmUpFunction
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

  return {
    invoke: _.curry(invoke)(config),
    warmUp: _.curry(warmUp)(config)
  }
}

export const invoke: InvokeFunction = async (
  { qualifier, endpoint, version, ...configArgs },
  { serviceName, functionName, ...optionsArgs }
) => {
  const path = `/services/${serviceName}.${qualifier}/functions/${functionName}/invocations`
  const url = `${endpoint}/${version}${path}`
  const exec = (
    retryNum = 0,
    { config, options }: { config: RequestConfig; options: RequestOptions }
  ) => {
    return async () => {
      let error!: Record<string, Record<string, unknown>>

      const result = await request(config, options)
        .then(({ data }) => data)
        .catch((err) => (error = err))

      const retry = (
        retry: number,
        error: Record<string, Record<string, unknown>>
      ) => {
        const isRetry =
          retry > 0 && ((error.status as unknown) as number) >= 500

        if (isRetry) {
          retry--

          return exec(retry, { config, options })
        }

        throw _.assoc('retry', retry, error)
      }

      return error ? retry(retryNum, error) : result
    }
  }

  return _.curry(exec)(0)({
    config: { qualifier, ...configArgs },
    options: { url, serviceName, functionName, ...optionsArgs }
  })
}

export const request: RequestFunction = async (
  { host, accountId, accessId, accessSecretKey, timeout, qualifier },
  { url, event, isAsync, serviceName, functionName }
) => {
  const method = 'POST'
  const buffer = eventToBuffer(
    _.assoc('headers', { 'x-service': 'service', ...event.headers }, event)
  )

  const headers = requestHeaders({
    content: buffer,
    host,
    accountId,
    isAsync
  })

  const token = requestToken({
    accessId,
    accessSecretKey,
    method,
    url,
    headers
  })

  return axios
    .request({
      url,
      method,
      data: buffer,
      timeout,
      headers: _.assoc('token', token, headers)
    })
    .then((result: AxiosResponse<any>) => result)
    .catch((error) => {
      throw handleError(
        {
          serviceName,
          functionName,
          requestId: error?.headers as Record<
            string,
            string
          >['x-fc-request-id'],
          env: qualifier
        },
        error
      )
    })
}

export const handleError: HandleErrorFunction = (
  { serviceName, functionName, requestId, env, ...args },
  error
) => {
  const status = (error.status as number) ?? 500
  const code =
    error.code && _.is(Number, error.code)
      ? (error.code as number)
      : error.status
      ? Number(`${error.status}000`)
      : 500000

  const isProdEnv = env === 'PROD' || env === 'PRE'
  const result = isProdEnv
    ? { code }
    : !error.status && !_.is(Number, error.code)
    ? { details: error }
    : error

  const currentApis = [{ serviceName, functionName, requestId, env, ...args }]
  const message = (error.message ??
    `${serviceName} ${functionName} invoke failed.`) as string

  const apis = !isProdEnv
    ? result.apis
      ? _.concat(result.apis as HandleErrorOptions[], currentApis)
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
    apis,
    ...args
  })
}

export const response: ResponseFunction = ({ data, status, headers }) => {
  const isCanonicalData =
    _.is(Object, data) && data.statusCode && _.is(Boolean, data.isBase64Encoded)

  const response = isCanonicalData
    ? data
    : { statusCode: status, isBase64Encoded: false, headers, body: data }

  const result =
    (response.headers as Record<string, string>['content-type']) ===
    'application/json; charset=utf-8'
      ? _.assoc('body', response, { body: JSON.parse(response.body as string) })
      : response

  if ((result.statusCode as number) >= 400) {
    throw result.body
  }

  return { data: result, status }
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
    }).catch((error: HandleErrorResult) => error))(serviceName)

  return Promise.all(_.map(exec)(functionNames))
}
