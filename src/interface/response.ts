import { InvokeResult } from './invoke'
import { ExecRequestResult } from './request'

/**
 * Handles the response.
 */
export interface HandleResponseFunction {
  (options: ExecRequestResult): InvokeResult
}

/**
 * Handles ali cloud gateway response options.
 */
export interface HandleAliCloudGatewayResponseOptions {
  /**
   * Response status code.
   */
  statusCode: number

  /**
   * Whether to encode in base64 or not.
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

/**
 * Handles ali cloud gateway responses.
 */
export interface HandleAliCloudGatewayResponseFunction {
  (options: HandleAliCloudGatewayResponseOptions): InvokeResult | never
}
