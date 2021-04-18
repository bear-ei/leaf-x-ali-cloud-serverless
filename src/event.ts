import { EventType } from './enum/error.enum'
import { HandleEvent, HandleGatewayEvent } from './interface/event.interface'

const handleGatewayEvent: HandleGatewayEvent = ({
  httpMethod = 'GET',
  isBase64Encoded = false,
  queryParameters = {},
  pathParameters = {},
  body = {},
  headers = {}
}) => {
  const type = 'application/json; charset=utf-8'
  const requestHeaders = {
    ...(!headers['content-type'] ? { 'content-type': type } : undefined),
    ...(!headers.accept ? { accept: '*/*' } : undefined),
    ...headers
  } as Record<string, string>

  const data = requestHeaders['content-type'].startsWith(type)
    ? JSON.stringify(body)
    : body

  return {
    httpMethod,
    isBase64Encoded,
    queryParameters,
    pathParameters,
    body: data,
    headers: requestHeaders
  }
}

export const handleEvent: HandleEvent = ({ type, data }) => {
  const eventType = Object.freeze({ gateway: handleGatewayEvent })

  return eventType[EventType[type]](data)
}
