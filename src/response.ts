import { Event } from './event'
import {
  HandleAliCloudGatewayResponseFunction,
  HandleAliCloudGatewayResponseOptions,
  HandleResponseFunction
} from './interface/response'

export const handleResponse: HandleResponseFunction = ({
  data,
  status,
  ...args
}) => {
  const response = Object.freeze({
    aliCloudGateway: handleAliCloudGatewayResponse
  })

  const aliCloudGatewayKeys = [
    'statusCode',
    'isBase64Encoded',
    'headers',
    'body'
  ]

  const aliCloudGatewayResponse =
    typeof data === 'object' &&
    data !== null &&
    Object.keys(data).sort().join() === aliCloudGatewayKeys.sort().join()

  return aliCloudGatewayResponse
    ? response[Event['ALI_ClOUD_GATEWAY']](
        data as HandleAliCloudGatewayResponseOptions
      )
    : { data, status, ...args }
}

export const handleAliCloudGatewayResponse: HandleAliCloudGatewayResponseFunction = ({
  statusCode,
  headers,
  body,
  isBase64Encoded
}) => {
  const data = isBase64Encoded
    ? Buffer.from(body as string, 'base64').toString()
    : body

  const result = {
    status: statusCode,
    headers,
    data: headers['content-type'].startsWith('application/json')
      ? JSON.parse(data as string)
      : data
  }

  if (statusCode >= 400) {
    throw result
  }

  return result
}
