import { EventType } from './enum/error.enum'
import {
  ProcessEvent,
  ProcessEventMethod,
  ProcessGatewayEvent
} from './interface/event.interface'

const processGatewayEvent: ProcessGatewayEvent = ({
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

  const data = (requestHeaders['content-type'] as string)?.startsWith(
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

export const processEvent: ProcessEvent = ({ type, data }) => {
  const processEventMethod: ProcessEventMethod = Object.freeze({
    gateway: processGatewayEvent
  })

  return processEventMethod[EventType[type]](data)
}
