import {FetchOptions} from '@leaf-x/fetch';
import {EventType, EventTypeString} from './event';

/**
 * Handles API gateway response options.
 */
export interface HandleGatewayResponseOptions {
  /**
   * API gateway response status code.
   */
  statusCode: number;

  /**
   * Whether to encode the request body in base64 or not.
   */
  isBase64Encoded: boolean;

  /**
   * API gateway response headers information.
   */
  headers: Record<string, string>;

  /**
   * API gateway response body.
   */
  body: unknown;
}

/**
 * Response events.
 */
export interface ResponseEvent {
  /**
   * Request response Body.
   */
  data: unknown;

  /**
   * Fetch options.
   */
  options: FetchOptions;

  /**
   * Request response headers.
   */
  headers: Record<string, string>;

  /**
   * Request response status code.
   */
  status: number;

  /**
   * Request response status code text description.
   */
  statusText: string;

  /**
   * Request URL.
   */
  url: string;
}

/**
 * Handle API gateway responses.
 *
 * @param options Handles API gateway response options.
 */
const handleGatewayResponse = ({
  statusCode,
  headers,
  body,
  isBase64Encoded,
}: HandleGatewayResponseOptions) => {
  const originalBody = isBase64Encoded
    ? Buffer.from(body as string, 'base64').toString()
    : body;

  const data = headers['content-type']?.startsWith('application/json')
    ? JSON.parse(originalBody as string)
    : originalBody;

  const result = {status: statusCode, headers, data};
  const isBusinessError = result.status < 200 || result.status >= 300;

  if (isBusinessError) {
    throw Object.assign(new Error('Invalid response.'), {...data});
  }

  return result;
};

/**
 * Handle response.
 *
 * @param type Event type string.
 * @param response Response events.
 */
export const handleResponse = (
  type: EventTypeString,
  response: ResponseEvent
) => {
  const handleResponseMethod = Object.freeze({
    gateway: handleGatewayResponse,
  });

  if (response.status === 202) {
    return response;
  }

  return handleResponseMethod[EventType[type]](
    response.data as HandleGatewayResponseOptions
  );
};
