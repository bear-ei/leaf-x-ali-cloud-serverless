import {FetchOptions, HandleResponseResult} from '@leaf-x/fetch';

/**
 * Request.
 *
 * @param url Request URL address.
 * @param options FetchOptions
 * @return Promise<HandleResponseResult>
 */
export interface Request {
  (url: string, options?: FetchOptions): Promise<HandleResponseResult>;
}
