import {HandleResponseResult} from '@leaf-x/fetch';
import {EventTypeString} from '../enum/event.enum';

/**
 * Serverless responds to event.
 */
export interface ResponseEvent {
  /**
   * Serverless response event type.
   */
  type: EventTypeString;

  /**
   * Serverless response.
   */
  response: HandleResponseResult;
}

/**
 * Serverless response result.
 */
export interface ResponseResult {
  /**
   * Serverless response data.
   */
  data: unknown;

  /**
   * Serverless response status code.
   */
  status: number;

  /**
   * Serverless response headers.
   */
  headers: Record<string, string>;
}

/**
 * Handle serverless response.
 *
 * @param response ResponseEvent
 * @return ResponseResult | HandleResponseResult
 */
export interface HandleResponse {
  (response: ResponseEvent): ResponseResult | HandleResponseResult;
}

/**
 * Options for Handle API gateway response.
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
 * Handle serverless response method.
 */
export interface HandleResponseMethod {
  /**
   * Handle API gateway response.
   */
  readonly gateway: HandleGatewayResponse;
}

/**
 * Handle API gateway response.
 *
 * @param options HandleGatewayResponseOptions
 * @return ResponseResult
 */
export interface HandleGatewayResponse {
  (options: HandleGatewayResponseOptions): ResponseResult;
}
