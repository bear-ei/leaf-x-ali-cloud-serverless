import * as crypto from 'crypto'
import { MD5Function } from 'src/interface/util/md5'

export const md5: MD5Function = (data) =>
  crypto.createHash('md5').update(data).digest('hex')
