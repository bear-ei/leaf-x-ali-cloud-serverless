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
  body,
  isBase64Encoded
}: AliCloudGatewayResponse): ResponseResult | never => {
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
