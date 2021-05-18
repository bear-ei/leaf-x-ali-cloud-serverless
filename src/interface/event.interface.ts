import {EventTypeString} from '../enum/event.enum';

export interface TriggerEvent {
  type: EventTypeString;

  data: HandleGatewayEventOptions;
}

export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS'
  | 'PUT'
  | 'PATCH'
  | 'PURGE'
  | 'LINK'
  | 'UNLINK';

export interface HandleEvent {
  (events: TriggerEvent): HandleGatewayEventOptions;
}

export interface HandleGatewayEventOptions {
  httpMethod?: HttpMethod;

  isBase64Encoded?: boolean;

  queryParameters?: Record<string, unknown>;

  pathParameters?: Record<string, string>;

  body?: unknown;

  headers?: Record<string, unknown>;
}

export interface HandleEventMethod {
  readonly gateway: HandleGatewayEvent;
}

export interface HandleGatewayEvent {
  (options: HandleGatewayEventOptions): HandleGatewayEventOptions;
}
