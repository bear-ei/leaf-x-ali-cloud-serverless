import { EventType } from './enum/error.enum'
import {
  HandleGatewayResponse,
  HandleGatewayResponseOptions,
  Response
} from './interface/response.interface'

const handleGatewayResponse: HandleGatewayResponse = ({
  statusCode,
  headers,
  body,
  isBase64Encoded
}) => {
  const originalBody = isBase64Encoded
    ? Buffer.from(body as string, 'base64').toString()
    : body

  const data = headers['content-type'].startsWith('application/json')
    ? JSON.parse(originalBody as string)
    : originalBody

  const result = { status: statusCode, headers, data }
  const error = result.status < 200 || result.status >= 300

  if (error) {
    throw data
  }

  return result
}

export const response: Response = ({ type, requestResponse }) => {
  const responseType = Object.freeze({ gateway: handleGatewayResponse })

  if (requestResponse.status === 202) {
    return requestResponse
  }

  return responseType[EventType[type]](
    requestResponse.data as HandleGatewayResponseOptions
  )
}
