import { FetchOptions, HandleResponseResult } from '@leaf-x/fetch'

/**
 * Request.
 */
export interface Request {
  (url: string, options?: FetchOptions): Promise<HandleResponseResult>
}
