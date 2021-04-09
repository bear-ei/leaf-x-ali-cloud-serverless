import { InvokeResult } from './invoke.interface'
import { ExecRequestResult } from './request.interface'

/**
 * Function to handle serverless responses.
 */
export interface HandleResponseFunction {
  (options: ExecRequestResult): InvokeResult
}

/**
 * Options to handle ali cloud gateway response.
 */
export interface HandleAliCloudGatewayResponseOptions {
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
 * Function to handle ali cloud gateway response.
 */
export interface HandleAliCloudGatewayResponseFunction {
  (options: HandleAliCloudGatewayResponseOptions): InvokeResult | never
}
