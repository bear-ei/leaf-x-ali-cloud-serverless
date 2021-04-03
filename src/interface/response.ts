import { InvokeResult } from './invoke'
import { ExecRequestResult } from './request'

/**
 * The function that handles the response.
 */
export interface HandleResponseFunction {
  (options: ExecRequestResult): InvokeResult
}

/**
 * Options for handling ali cloud gateway responses.
 */
export interface HandleAliCloudGatewayResponseOptions {
  /**
   * Response status code.
   */
  statusCode: number

  /**
   * Whether the request entity is Base64 encoded.
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
 * Function to handle ali cloud gateway response.
 */
export interface HandleAliCloudGatewayResponseFunction {
  (options: HandleAliCloudGatewayResponseOptions): InvokeResult | never
}
