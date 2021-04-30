import { ProcessResponseResult } from '@leaf-x/fetch'
import { EventType } from './event.interface'

/**
 * Response events.
 */
export interface ResponseEvent {
  /**
   * Event type.
   */
  type: EventType

  /**
   * Response.
   */
  response: ProcessResponseResult
}

/**
 * Response results.
 */
export interface ResponseResult {
  /**
   * Response data.
   */
  data: unknown

  /**
   * Response status code.
   */
  status: number

  /**
   * Response headers.
   */
  headers: Record<string, unknown>
}

/**
 * Response.
 * @param options ResponseEvent
 * @return ResponseResult | ProcessResponseResult
 */
export interface Response {
  (options: ResponseEvent): ResponseResult | ProcessResponseResult
}

/**
 * Process gateway response options.
 */
export interface ProcessGatewayResponseOptions {
  /**
   * Gateway response status code.
   */
  statusCode: number

  /**
   * Whether or not the request body is base64 encoded.
   */
  isBase64Encoded: boolean

  /**
   * Gateway response headers.
   */
  headers: Record<string, unknown>

  /**
   * Gateway response body.
   */
  body: unknown
}

/**
 * Processing response method.
 */
export interface ProcessResponseMethod {
  readonly gateway: ProcessGatewayResponse
}

/**
 * Process gateway response.
 *
 * @param options ProcessGatewayResponseOptions
 * @return ResponseResult
 */
export interface ProcessGatewayResponse {
  (options: ProcessGatewayResponseOptions): ResponseResult
}
