import * as crypto from 'crypto';
import {getCanonicalHeadersString} from './headers';
import {
  GetRequestToken,
  GetSignString,
  Sign,
} from './interface/token.interface';

const sign: Sign = ({secret, signString}) => {
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

  return [
    method,
    headers['content-md5'],
    headers['content-type'],
    headers['date'],
    canonicalHeaderString,
    encodeURI(new URL(url).pathname),
  ].join('\n');
};

export const getRequestToken: GetRequestToken = ({
  accessId,
  accessSecretKey,
  ...args
}) => {
  const signString = getSignString(args);

  return `FC ${accessId}:${sign({secret: accessSecretKey, signString})}`;
};
