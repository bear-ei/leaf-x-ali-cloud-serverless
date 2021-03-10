import {
  AliCloudGatewayResponse,
  ResponseFunction,
  ResponseResult
} from './interface/response'

export const response: ResponseFunction = ({ data, status, ...args }) => {
  const aliCloudGatewayKeys = [
    'statusCode',
    'isBase64Encoded',
    'headers',
    'body'
  ]

  const aliCloudGatewayData =
    typeof data === 'object' &&
    data !== null &&
    Object.keys(data).sort().join() === aliCloudGatewayKeys.sort().join()

  return aliCloudGatewayData
    ? aliCloudGatewayResponse(data as AliCloudGatewayResponse)
    : { data, status, ...args }
}

export const aliCloudGatewayResponse = ({
  statusCode,
  headers,
  body
}: AliCloudGatewayResponse): ResponseResult | never => {
  const data = headers['content-type'].startsWith('application/json')
    ? JSON.parse(body as string)
    : body

  if (statusCode >= 400) {
    throw data
  }

  return { status: statusCode, headers, data }
}
