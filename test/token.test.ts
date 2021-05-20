import * as assert from 'assert';
import {getRequestToken} from '../src/token';

describe('test/token.test.ts', () => {
  it('should get the request token', async () => {
    const result = getRequestToken({
      accessId: '123456',
      accessSecretKey: 'MTIz',
      method: 'GET',
      url: 'https://leaf-x.app',
      headers: {'content-type': 'application/octet-stream; charset=utf-8'},
    });

    assert(typeof result === 'string');
  });
});
