import * as crypto from 'crypto'

/**
 * MD5.
 */
export interface MD5Function {
  (options: crypto.BinaryLike): string
}
