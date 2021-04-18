import { HandleResponseResult } from '@leaf-x/fetch'
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
   * Request response.
   */
  requestResponse: HandleResponseResult
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
 */
export interface Response {
  (options: ResponseEvent): ResponseResult | HandleResponseResult
}

/**
 * Handle gateway response options.
 */
export interface HandleGatewayResponseOptions {
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
  headers: Record<string, string>

  /**
   * Gateway response body.
   */
  body: unknown
}

/**
 * Handle gateway response.
 */
export interface HandleGatewayResponse {
  (options: HandleGatewayResponseOptions): ResponseResult | never
}
