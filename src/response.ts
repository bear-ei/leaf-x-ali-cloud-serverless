import {FetchOptions} from '@leaf-x/fetch';
import {throwError} from './error';
import {EventType, EventTypeString} from './event';

/**
 * Handles API gateway response options.
 */
export interface HandleGatewayResponseOptions {
  /**
   *  API gateway response status code.
   */
  statusCode: number;

  /**
   * Whether the event body is base64 encoded or not.
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
 * Response event.
 */
export interface ResponseEvent {
  /**
   * Respond to the event body.
   */
  data: unknown;

  /**
   * The options to initiate an event.
   */
  options: FetchOptions;

  /**
   * Response event headers information.
   */
  headers: Record<string, string>;

  /**
   * Response event status code.
   */
  status: number;

  /**
   * Response event status code text description.
   */
  statusText: string;

  /**
   * Request URL.
   */
  url: string;
}

/**
 * Handle API gateway response.
 *
 * @param options API gateway response options.
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

  (result.status < 200 || result.status >= 300) && throwError(data);

  return result;
};

/**
 * Handle response event.
 *
 * @param type Response event type.
 * @param response Response event.
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
