import fetch from '@leaf-x/fetch'
import { Request } from './interface/request.interface'

export const request: Request = (url, options) => fetch(url, options)
