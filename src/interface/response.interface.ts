import {HandleResponseResult} from '@leaf-x/fetch';
import {EventTypeString} from '../enum/event.enum';

/**
 * Response event.
 */
export interface ResponseEvent {
  /**
   * Response event type.
   */
  type: EventTypeString;

  /**
   * Response.
   */
  response: HandleResponseResult;
}

/**
 * Response result.
 */
export interface ResponseResult {
  /**
   * Response data.
   */
  data: unknown;

  /**
   * Response status code.
   */
  status: number;

  /**
   * Response headers.
   */
  headers: Record<string, string>;
}

/**
 * Handle responses.
 *
 * @param response ResponseEvent
 * @return ResponseResult | HandleResponseResult
 */
export interface HandleResponse {
  (responseEvent: ResponseEvent): ResponseResult | HandleResponseResult;
}

/**
 * Handle gateway response options.
 */
export interface HandleGatewayResponseOptions {
  /**
   * Response status code.
   */
  statusCode: number;

  /**
   * Whether to base64 encode the response body or not.
   */
  isBase64Encoded: boolean;

  /**
   * Response headers.
   */
  headers: Record<string, string>;

  /**
   * Response body.
   */
  body: unknown;
}

/**
 * Handle response method.
 */
export interface HandleResponseMethod {
  /**
   * Handle gateway response.
   */
  readonly gateway: HandleGatewayResponse;
}

/**
 * Handle gateway response.
 *
 * @param options HandleGatewayResponseOptions
 * @return ResponseResult
 */
export interface HandleGatewayResponse {
  (options: HandleGatewayResponseOptions): ResponseResult;
}
