import {FetchOptions, HandleResponseResult} from '@leaf-x/fetch';

/**
 * Initialize request options.
 */
export interface InitRequestOptions {
  /**
   * Serverless host.
   */
  host: string;

  /**
   * Ali cloud account ID.
   */
  accountId: string;

  /**
   * Ali cloud access key.
   */
  accessSecretKey: string;

  /**
   * Ali cloud access ID.
   */
  accessId: string;
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
 */
export interface RequestOptions extends FetchOptions {
  /**
   * Whether to perform asynchronous invoke.
   */
  async?: boolean;
}

/**
 * Request.
 *
 * @param url Request URL address.
 * @param options RequestOptions
 * @return Promise<HandleResponseResult>
 */
export interface Request {
  (url: string, options?: RequestOptions): Promise<HandleResponseResult>;
}
