import { EventType as EventTypeEnum } from './enum/event.enum'
import {
  HandleEvent,
  HandleEventMethod,
  HandleGatewayEvent
} from './interface/event.interface'

const handleGatewayEvent: HandleGatewayEvent = ({
  httpMethod = 'GET',
  isBase64Encoded = false,
  queryParameters = {},
  pathParameters = {},
  body = {},
  headers = {}
}) => {
  const requestHeaders = {
    ...(!headers['content-type']
      ? { 'content-type': 'application/json; charset=utf-8' }
      : undefined),
    ...(!headers.accept ? { accept: '*/*' } : undefined),
    ...headers
  } as Record<string, unknown>

  const data = (requestHeaders['content-type'] as string).startsWith(
    'application/json'
  )
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
  const handleEventMethod: HandleEventMethod = Object.freeze({
    gateway: handleGatewayEvent
  })

  return handleEventMethod[EventTypeEnum[type]](data)
}
