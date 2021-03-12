import { HandleErrorFunction, HandleErrorOptions } from './interface/error'

export const handleError: HandleErrorFunction = (
  { serviceName, functionName, requestId, env },
  error
) => {
  const status = (error.status ?? 500) as number
  const code = (error.code ? error.code : Number(`${status}000`)) as number
  const result = error.status && error.code ? error : { details: error }
  const currentApis = [{ serviceName, functionName, requestId, env }]
  const message = (error.message ??
    `${serviceName} ${functionName} invoke failed.`) as string

  const apis = Array.isArray(result.apis)
    ? currentApis.concat(result.apis)
    : currentApis

  return Object.assign({}, result, {
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

export const handleRequestError = (
  { serviceName, functionName, requestId, env }: HandleErrorOptions,
  error: Record<string, unknown>
): never => {
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
