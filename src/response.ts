import { EventType as EventTypeEnum } from './enum/event.enum'
import {
  HandleGatewayResponse,
  HandleGatewayResponseOptions,
  HandleResponseMethod,
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

  const data = (headers['content-type'] as string)?.startsWith(
    'application/json'
  )
    ? JSON.parse(originalBody as string)
    : originalBody

  const result = { status: statusCode, headers, data }
  const error = result.status < 200 || result.status >= 300

  if (error) {
    throw data
  }

  return result
}

export const response: Response = ({ type, response }) => {
  const handleResponseMethod: HandleResponseMethod = Object.freeze({
    gateway: handleGatewayResponse
  })

  if (response.status === 202) {
    return response
  }

  return handleResponseMethod[EventTypeEnum[type]](
    response.data as HandleGatewayResponseOptions
  )
}
