import {
  HandleErrorFunction,
  HandleRequestErrorFunction
} from './interface/error'

export const handleError: HandleErrorFunction = (
  error,
  { serviceName, functionName, requestId, env }
) => {
  const status = (error.status ?? 500) as number
  const code = (error.code ?? Number(`${status}000`)) as number
  const err = error.status && error.code ? error : { details: error }
  const currentApis = [{ serviceName, functionName, requestId, env }]
  const message = (error.message ??
    `${serviceName} ${functionName} invoke failed.`) as string

  const apis = Array.isArray(err.apis)
    ? currentApis.concat(err.apis)
    : currentApis

  return Object.assign({}, err, {
    status,
    code,
    serviceName,
    functionName,
    requestId,
    message,
    env,
    apis
  })
}

export const handleRequestError: HandleRequestErrorFunction = (
  error,
  { serviceName, functionName, requestId, env }
) => {
  const responseError = error.response as Record<string, unknown>

  if (responseError) {
    const requestId = responseError.headers as Record<
      string,
      string
    >['x-fc-request-id']

    throw handleError(responseError.data as Record<string, unknown>, {
      serviceName,
      functionName,
      requestId,
      env
    })
  }

  throw handleError(error, { serviceName, functionName, requestId, env })
}
