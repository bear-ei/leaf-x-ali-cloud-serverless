import axios from 'axios'
import { handleRequestError } from './error'
import { RequestFunction, RequestResult } from './interface/request'
import { eventToBuffer } from './util/eventToBuffer'
import { getHeaders } from './util/header'
import { getToken } from './util/token'

export const request: RequestFunction = async (
  { host, accountId, accessId, accessSecretKey, timeout, qualifier },
  { url, event, async, serviceName, functionName }
) => {
  const method = 'POST'
  const buffer = eventToBuffer(event)
  const headers = getHeaders({
    content: buffer,
    host,
    accountId,
    async
  })

  const token = getToken({
    accessId,
    accessSecretKey,
    method,
    url,
    headers
  })

  return axios
    .request({
      url,
      method,
      data: buffer,
      timeout,
      headers: Object.assign({}, headers, { authorization: token })
    })
    .then((result) => (result as unknown) as RequestResult)
    .catch((error) =>
      handleRequestError(
        {
          serviceName,
          functionName,
          env: qualifier,
          requestId: headers.requestId
        },
        error
      )
    )
}
