import * as assert from 'assert';
import {handleToken} from '../src/token';

describe('test/token.test.ts', () => {
  it('should be handle token', async () => {
    const result = handleToken({
      accessId: '123456',
      accessSecretKey: 'MTIz',
      method: 'GET',
      url: 'https://leaf-x.com',
      headers: {'content-type': 'application/octet-stream; charset=utf-8'},
    });

    assert(typeof result === 'string');
  });
});
