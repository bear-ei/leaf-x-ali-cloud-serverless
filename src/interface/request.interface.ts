import {FetchOptions, HandleResponseResult} from '@leaf-x/fetch';
import {AliCloudOptions} from './serverless.interface';

/**
 * Options for initialize request.
 *
 * @extends AliCloudOptions
 */
export interface InitRequestOptions extends AliCloudOptions {
  /**
   * Serverless host.
   */
  host: string;
}

/**
 * The function that initialize the request.
 *
 * @param options InitRequestOptions
 * @return Request
 */
export interface InitRequest {
  (options: InitRequestOptions): Request;
}

/**
 * The request options.
 *
 * @extends FetchOptions
 */
export interface RequestOptions extends FetchOptions {
  /**
   * Whether to request asynchronously or not.
   */
  async?: boolean;
}

/**
 * Request API.
 *
 * @param url URL of the request.
 * @param options RequestOptions
 * @return Promise<HandleResponseResult>
 */
export interface Request {
  (url: string, options?: RequestOptions): Promise<HandleResponseResult>;
}
