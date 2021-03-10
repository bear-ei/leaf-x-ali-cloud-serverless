import { InvokeResult } from './invoke'
import { RequestResult } from './request'

/**
 * Response options.
 */
export type ResponseOptions = RequestResult

/**
 * Response results.
 */
export type ResponseResult = InvokeResult

/**
 * Response.
 */
export interface ResponseFunction {
  (options: ResponseOptions): ResponseResult
}

/**
 * Ali cloud gateway options.
 */
export interface AliCloudGatewayResponse {
  /**
   * Response status code.
   */
  statusCode: number

  /**
   * Whether to encode the response body in base64.
   */
  isBase64Encoded: boolean

  /**
   * Response headers.
   */
  headers: Record<string, string>

  /**
   * Response body.
   */
  body: unknown
}

export interface AliCloudGatewayData {
  (options: AliCloudGatewayResponse): ResponseResult | never
}
