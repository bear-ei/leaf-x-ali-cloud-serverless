import {HandleResponseResult} from '@leaf-x/fetch';
import {EventType} from './event.interface';

/**
 * Response event.
 */
export interface ResponseEvent {
  /**
   * Event type.
   */
  type: EventType;

  /**
   * Handle the request response result.
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
  headers: Record<string, unknown>;
}

/**
 * Response.
 *
 * @param events ResponseEvent
 * @return ResponseResult | HandleResponseResult
 */
export interface Response {
  (events: ResponseEvent): ResponseResult | HandleResponseResult;
}

/**
 * Handle gateway response options.
 */
export interface HandleGatewayResponseOptions {
  /**
   * Gateway response status code.
   */
  statusCode: number;

  /**
   * Whether to base64 encode the request body or not.
   */
  isBase64Encoded: boolean;

  /**
   * Gateway response headers.
   */
  headers: Record<string, unknown>;

  /**
   * Gateway response body.
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
