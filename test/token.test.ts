import * as assert from 'assert';
import {getToken} from '../src/token';

describe('test/token.test.ts', () => {
  it('should be the result of getting request token', async () => {
    const result = getToken({
      accessId: '123456',
      accessSecretKey: 'MTIz',
      method: 'GET',
      url: 'https://leaf-x.app',
      headers: {'content-type': 'application/octet-stream; charset=utf-8'},
    });

    assert(typeof result === 'string');
  });
});
