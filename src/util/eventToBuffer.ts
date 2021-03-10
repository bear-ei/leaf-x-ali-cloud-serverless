import { flow } from 'lodash/fp'
import { EventToBufferFunction } from '../interface/util/eventToBuffer'

export const eventToBuffer: EventToBufferFunction = ({
  httpMethod = 'GET',
  isBase64Encoded = false,
  queryParameters = {},
  pathParameters = {},
  body = {},
  headers = {
    'content-type': 'application/json; charset=utf-8',
    accept: 'application/json; charset=utf-8'
  }
}) =>
  flow(
    JSON.stringify,
    Buffer.from
  )({
    httpMethod,
    isBase64Encoded,
    queryParameters,
    pathParameters,
    body: JSON.stringify(body),
    headers
  })
