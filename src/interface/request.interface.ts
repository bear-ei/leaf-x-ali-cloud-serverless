import {FetchOptions, HandleResponseResult} from '@leaf-x/fetch';
import {AliCloudOptions} from './serverless.interface';

/**
 * Initialize request options.
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
 * Initialize request.
 *
 * @param options InitRequestOptions
 * @return Request
 */
export interface InitRequest {
  (options: InitRequestOptions): Request;
}

/**
 * Request options.
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
 * @param url Request URL.
 * @param options RequestOptions
 * @return Promise<HandleResponseResult>
 */
export interface Request {
  (url: string, options?: RequestOptions): Promise<HandleResponseResult>;
}
