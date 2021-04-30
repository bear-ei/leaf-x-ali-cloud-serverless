import { FetchOptions, ProcessResponseResult } from '@leaf-x/fetch'

/**
 * Request.
 *
 * @param url Request URL address.
 * @param options FetchOptions
 * @return Promise<ProcessResponseResult>
 */
export interface Request {
  (url: string, options?: FetchOptions): Promise<ProcessResponseResult>
}
