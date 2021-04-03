import {
  HandleAliCloudGatewayEventFunction,
  HandleEventToBufferFunction
} from './interface/event'

export enum Event {
  ALI_ClOUD_GATEWAY = 'aliCloudGateway'
}

export const handleEventToBuffer: HandleEventToBufferFunction = ({
  type,
  data
}) => {
  const event = Object.freeze({
    aliCloudGateway: handleAliCloudGatewayEvent
  })

  const handleEvent = event[Event[type]]

  if (!handleEvent) {
    throw new Error('Invalid event type.')
  }

  return Buffer.from(handleEvent(data))
}

export const handleAliCloudGatewayEvent: HandleAliCloudGatewayEventFunction = ({
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

    ...(!headers.accept
      ? { accept: 'application/json; charset=utf-8' }
      : undefined),

    ...headers
  } as Record<string, string>

  const data = requestHeaders['content-type'].startsWith('application/json')
    ? JSON.stringify(body)
    : body

  return JSON.stringify({
    httpMethod,
    isBase64Encoded,
    queryParameters,
    pathParameters,
    body: data,
    headers: requestHeaders
  })
}
