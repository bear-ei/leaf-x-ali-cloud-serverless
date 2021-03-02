import * as R from 'ramda'
import axios from 'axios'
import {
  AliCloudGatewayDataFunction,
  AliCloudGatewayOptions,
  ExecRequestFunction,
  FCFunction,
  HandleErrorFunction,
  HandleRequestErrorFunction,
  InvokeFunction,
  PreheatFunction,
  RequestFunction,
  RequestResult,
  ResponseFunction,
  RetryRequestFunction,
  HandleErrorResult,
  HandleErrorOptions
} from './interface'
import {
  eventToBuffer,
  getRequestHeaders,
  getRequestToken,
  sortStr
} from './util'
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

  return { invoke: invoke(config), preheat: preheat(config) }
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

    const result = (await request(config, options)
      .then((result) => result)
      .catch((err) => (error = err))) as RequestResult

    const retry: RetryRequestFunction = (retry, error) => {
      const isRetry = retry > 0 && ((error.status as unknown) as number) >= 500

      if (isRetry) {
        retry--

        return R.curry(exec)(retry)({ config, options })
      }

      throw error
    }

    return error ? R.curry(retry)(retryNum)(error) : result
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
      ? (result.apis as HandleErrorOptions[]).concat(currentApis)
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
  const aliCloudGateway = [
    'statusCode',
    'isBase64Encoded',
    'headers',
    'body'
  ].sort(sortStr)

  const isAliCloudGatewayData =
    R.is(Object)(data) &&
    Object.keys(data as Record<string, unknown>)
      .sort(sortStr)
      .toString() === aliCloudGateway.toString()

  const aliCloudGatewayData: AliCloudGatewayDataFunction = ({
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

  return isAliCloudGatewayData
    ? aliCloudGatewayData(data as AliCloudGatewayOptions)
    : { data, status, ...args }
}

export const preheat: PreheatFunction = (config) => async ({
  serviceName,
  functionNames
}) => {
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
  const headers = getRequestHeaders({
    content: buffer,
    host,
    accountId,
    isAsync
  })

  const token = getRequestToken({
    accessId,
    accessSecretKey,
    method,
    url,
    headers
  })

  const handleRequestError: HandleRequestErrorFunction = (error) => {
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

  return axios
    .request({
      url,
      method,
      data: buffer,
      timeout,
      headers: Object.assign(headers, { authorization: token })
    })
    .then((result) => (result as unknown) as RequestResult)
    .catch((error) => handleRequestError(error))
}
