import * as crypto from 'crypto';
import {getCanonicalHeadersString} from './headers';
import {GetSignString, GetToken, InitSign} from './interface/token.interface';

const initSign: InitSign = secret => signString => {
  const buffer = crypto
    .createHmac('sha256', secret)
    .update(signString, 'utf8')
    .digest();

  return Buffer.from(buffer).toString('base64');
};

const getSignString: GetSignString = ({method, url, headers}) => {
  const canonicalHeaderString = getCanonicalHeadersString(
    {prefix: 'x-fc-'},
    headers
  );
  const pathname = decodeURIComponent(new URL(url).pathname);

  return [
    method,
    headers['content-md5'],
    headers['content-type'],
    headers['date'],
    canonicalHeaderString,
    pathname,
  ].join('\n');
};

export const getToken: GetToken = ({accessId, accessSecretKey, ...args}) => {
  const signString = getSignString(args);

  return `FC ${accessId}:${initSign(accessSecretKey)(signString)}`;
};
