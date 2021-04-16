import AbortController from 'abort-controller'
import * as fetch from 'isomorphic-fetch'
import { ExecRequestFunction } from './interface/request.interface'

const checkStatus = (response: Response): Response | never => {
  if (response.ok) {
    return response
  } else {
    const error = new Error(response.statusText)

    throw Object.assign(error, { response })
  }
}

const parseData = (response: Response) =>
  response.headers.get('content-type')?.startsWith('application/json')
    ? response.json()
    : response.text()

// const handleError = (error: Record<string, unknown>): never =>
//   handleRequestError(error, {
//     serviceName,
//     functionName,
//     env: qualifier,
//     requestId: headers.requestId
//   })

export const request: ExecRequestFunction = async (
  { url, event, async, serviceName, functionName },
  { host, accountId, accessId, accessSecretKey, timeout, qualifier }
) => {
  //   const method = 'POST'
  //   const buffer = handleEventToBuffer(event)
  //   const headers = getHeaders({ content: buffer, host, accountId, async })
  //   const token = getToken({ accessId, accessSecretKey, method, url, headers })
  const controller = new AbortController()
  const signal = controller.signal

  setTimeout(() => controller.abort(), timeout)

  return fetch(url, {
    method,
    body: buffer,
    headers: Object.assign({}, headers, { authorization: token }),
    signal
  })
    .then(checkStatus)
    .then(parseData)
  // .catch(handleError)
}
