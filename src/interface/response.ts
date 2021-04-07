import { InvokeResult } from './invoke'
import { ExecRequestResult } from './request'

/**
 * Handle the response.
 */
export interface HandleResponseFunction {
  (options: ExecRequestResult): InvokeResult
}

/**
 * Handle ali cloud gateway response options.
 */
export interface HandleAliCloudGatewayResponseOptions {
  /**
   * Gateway response status code.
   */
  statusCode: number

  /**
   * If or not to base64 encode the body.
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
 * Handle Ali cloud gateway responses.
 */
export interface HandleAliCloudGatewayResponseFunction {
  (options: HandleAliCloudGatewayResponseOptions): InvokeResult | never
}
