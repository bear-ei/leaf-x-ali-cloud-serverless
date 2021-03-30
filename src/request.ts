import axios from 'axios'
import { handleRequestError } from './error'
import { handleEventToBuffer } from './event'
import { getHeaders } from './headers'
import { ExecRequestFunction, ExecRequestResult } from './interface/request'
import { getToken } from './token'

export const execRequest: ExecRequestFunction = async (
  { url, event, async, serviceName, functionName },
  { host, accountId, accessId, accessSecretKey, timeout, qualifier }
) => {
  const method = 'POST'
  const buffer = handleEventToBuffer(event)
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
    .then((result) => (result as unknown) as ExecRequestResult)
    .catch((error) =>
      handleRequestError(error, {
        serviceName,
        functionName,
        env: qualifier,
        requestId: headers.requestId
      })
    )
}
