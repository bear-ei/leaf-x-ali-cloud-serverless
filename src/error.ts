import {
  HandleErrorFunction,
  HandleRequestErrorFunction
} from './interface/error'

export const handleError: HandleErrorFunction = (
  { serviceName, functionName, requestId, env },
  error
) => {
  const status = (error.status ?? 500) as number
  const code = (error.code ? error.code : Number(`${status}000`)) as number
  const err = error.status && error.code ? error : { details: error }
  const currentApis = [{ serviceName, functionName, requestId, env }]
  const message = (error.message ??
    `${serviceName} ${functionName} invoke failed.`) as string

  const functions = Array.isArray(err.functions)
    ? currentApis.concat(err.functions)
    : currentApis

  return Object.assign({}, err, {
    status,
    code,
    serviceName,
    functionName,
    requestId,
    message,
    env,
    functions
  })
}

export const handleRequestError: HandleRequestErrorFunction = (
  { serviceName, functionName, requestId, env },
  error
) => {
  const responseError = error.response as Record<string, unknown>

  if (responseError) {
    const requestId = responseError.headers as Record<
      string,
      string
    >['x-fc-request-id']

    throw handleError(
      { serviceName, functionName, requestId, env },
      responseError.data as Record<string, unknown>
    )
  }

  throw handleError({ serviceName, functionName, requestId, env }, error)
}
