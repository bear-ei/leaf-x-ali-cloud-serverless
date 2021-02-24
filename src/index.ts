'use strict'

import * as _ from 'ramda'
import axios from 'axios'
import { eventToBuffer, requestHeaders, requestToken } from './util'
import { HandleErrorFunction, HandleErrorOptions } from './interface/util'
import { InvokeFunction, InvokeOptions, RequestOptions } from './interface'

export const fc = ({
  accountId,
  accessId,
  accessSecretKey,
  region,
  timeout = 30000,
  version = '2016-08-15',
  qualifier = 'LATEST',
  internal = true,
  secure = false
}: any) => {
  const protocol = secure ? 'https' : 'http'
  const network = internal ? '-internal' : ''
  const endpoint = `${protocol}://${accountId}.${region}${network}.fc.aliyuncs.com`
  const host = `${accountId}.${region}${network}.fc.aliyuncs.com`

  return {
    invoke: _.curry(invoke)({ qualifier, endpoint, version }),
    handleError
  }
}

export const invoke: InvokeFunction = (
  { qualifier, endpoint, version, ...configArgs },
  { serviceName, functionName, ...optionsArgs }
) => {
  const path = `/services/${serviceName}.${qualifier}/functions/${functionName}/invocations`
  const url = `${endpoint}/${version}${path}`

  const exec = (retryNum = 0, { configs, options }) => {
    return async () => {
      let error!: Record<string, unknown>

      const results = await request(configs, options)
        .then(({ data }) => data)
        .catch((err) => (error = err))

      const retry = (retry: number, error: Record<string, unknown>) => {
        const isRetry = retry > 0 && error?.status >= 500

        if (isRetry) {
          retry--

          return exec(retry, options)
        }

        throw _.assoc('retry', retry, error)
      }

      return error ? retry(retryNum, error) : results
    }
  }

  return _.curry(exec)(0)({
    configs: { qualifier, ...configArgs },
    options: { serviceName, functionName, ...optionsArgs }
  })
}

export const request = async (
  {
    host,
    accountId,
    accessId,
    accessSecretKey,
    version,
    timeout,
    qualifier
  }: any,
  { url, event, isAsync, path, serviceName, functionName }: RequestOptions
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
    path: `/${version}${path}`,
    headers
  })

  return await axios
    .request({
      url,
      method,
      data: buffer,
      timeout,
      headers: _.assoc('token', token, headers)
    })
    .then((result) => result)
    .catch((error) =>
      handleError(
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
    )
}

export const handleError: HandleErrorFunction = (
  { serviceName, functionName, requestId, env, ...args },
  error
) => {
  const status = (error.status as number) ?? 500
  const code =
    error.code && _.is('number', error.code)
      ? (error.code as number)
      : error.status
      ? Number(`${error.status}000`)
      : 500000

  const isProdEnv = env === 'PROD' || env === 'PRE'
  const results = isProdEnv
    ? { code }
    : !error.status && !_.is('number', error.code)
    ? { details: error }
    : error

  const currentApis = [{ serviceName, functionName, requestId, env, ...args }]
  const message = (error.message ??
    `${serviceName} ${functionName} invoke failed.`) as string

  const apis = !isProdEnv
    ? results.apis
      ? _.concat(results.apis as HandleErrorOptions[], currentApis)
      : currentApis
    : []

  return Object.assign({}, results, {
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
