import {HandleResponseResult} from '@leaf-x/fetch';
import {EventType, EventTypeString} from './event';

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
 * Handle API gateway response.
 *
 * @param options HandleGatewayResponseOptions
 * @return ResponseResult
 */
export interface HandleGatewayResponse {
  (options: HandleGatewayResponseOptions): ResponseResult;
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
 * Handle serverless response.
 *
 * @param response ResponseEvent
 * @return ResponseResult | HandleResponseResult
 */
export interface HandleResponse {
  (response: ResponseEvent): ResponseResult | HandleResponseResult;
}

const handleGatewayResponse: HandleGatewayResponse = ({
  statusCode,
  headers,
  body,
  isBase64Encoded,
}) => {
  const originalBody = isBase64Encoded
    ? Buffer.from(body as string, 'base64').toString()
    : body;

  const data = headers['content-type']?.startsWith('application/json')
    ? JSON.parse(originalBody as string)
    : originalBody;

  const result = {status: statusCode, headers, data};
  const error = result.status < 200 || result.status >= 300;

  if (error) {
    throw Object.assign(new Error('Invalid response.'), {...data});
  }

  return result;
};

export const handleResponse: HandleResponse = ({type, response}) => {
  const handleResponseMethod: HandleResponseMethod = Object.freeze({
    gateway: handleGatewayResponse,
  });

  if (response.status === 202) {
    return response;
  }

  return handleResponseMethod[EventType[type]](
    response.data as HandleGatewayResponseOptions
  );
};
