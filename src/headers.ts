import * as crypto from 'crypto';
import {HttpMethod} from './interface/event.interface';
import {
  GetCanonicalHeadersString,
  InitGetRequestHeaders,
  InitSpliceCanonicalHeaders,
} from './interface/headers.interface';
import {getToken} from './token';

const initSpliceCanonicalHeaders: InitSpliceCanonicalHeaders = headers => key =>
  `${key}:${headers[key]}`;

export const initGetRequestHeaders: InitGetRequestHeaders = ({
  host,
  accountId,
  accessSecretKey,
  accessId,
}) => ({content, method, url, async}) => {
  const headers = {
    accept: '*/*',
    date: new Date().toUTCString(),
    host,
    'user-agent': `Node.js(${process.version}) OS(${process.platform}/${process.arch})`,
    'x-fc-account-id': accountId,
    'content-type': 'application/json; charset=utf-8',
    'content-md5': crypto.createHash('md5').update(content).digest('hex'),
    'content-length': Buffer.isBuffer(content)
      ? `${content.length}`
      : `${Buffer.from(content).length}`,
    ...(async ? {'x-fc-invocation-type': 'Async'} : undefined),
  };

  const authorization = getToken({
    accessId,
    accessSecretKey,
    method: method as HttpMethod,
    url,
    headers,
  });

  return {authorization, ...headers};
};

export const getCanonicalHeadersString: GetCanonicalHeadersString = (
  {prefix},
  headers
) => {
  const spliceCanonicalHeaders = initSpliceCanonicalHeaders(headers);

  return Object.keys(headers)
    .filter(key => key.startsWith(prefix))
    .sort()
    .map(spliceCanonicalHeaders)
    .join('\n');
};
