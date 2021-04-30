/**
 * Event type.
 */
export type EventType = 'GATEWAY'

/**
 * Trigger events.
 */
export interface TriggerEvent {
  type: EventType
  data: ProcessGatewayEventOptions
}

/**
 * Http request method.
 */
export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS'
  | 'PUT'
  | 'PATCH'
  | 'PURGE'
  | 'LINK'
  | 'UNLINK'

/**
 * Process the event.
 *
 * @param options TriggerEvent
 * @return ProcessGatewayEventOptions
 */
export interface ProcessEvent {
  (options: TriggerEvent): ProcessGatewayEventOptions
}

/**
 * Process gateway event options.
 */
export interface ProcessGatewayEventOptions {
  httpMethod?: HttpMethod

  /**
   * Whether to base64 encode the request body.
   */
  isBase64Encoded?: boolean

  /**
   * Query parameters.
   */
  queryParameters?: Record<string, unknown>

  /**
   * Path parameters.
   */
  pathParameters?: Record<string, string>

  /**
   * Request body.
   */
  body?: unknown

  /**
   * Request headers.
   */
  headers?: Record<string, unknown>
}

/**
 * Processing event method.
 */
export interface ProcessEventMethod {
  readonly gateway: ProcessGatewayEvent
}

/**
 * Process gateway events.
 *
 * @param options ProcessGatewayEventOptions
 * @return ProcessGatewayEventOptions
 */
export interface ProcessGatewayEvent {
  (options: ProcessGatewayEventOptions): ProcessGatewayEventOptions
}
