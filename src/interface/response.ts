import { InvokeResult } from './invoke'
import { ExecRequestResult } from './request'

/**
 * Handle response.
 */
export interface HandleResponseFunction {
  (options: ExecRequestResult): InvokeResult
}

/**
 * Handle ali cloud gateway options.
 */
export interface HandleAliCloudGatewayResponseOptions {
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

/**
 * Handle ali cloud gateway responses.
 */
export interface HandleAliCloudGatewayResponseFunction {
  (options: HandleAliCloudGatewayResponseOptions): InvokeResult | never
}
