import * as assert from 'assert';
import {initRequest} from '../src/request';

describe('test/request.test.ts', () => {
  it('should be the result of a default option request', async () => {
    const result = await initRequest({
      host: '',
      accountId: '213',
      accessSecretKey: '5556123',
      accessId: '58575729',
    })('https://www.bing.com/');

    assert(result.status === 200);
  });

  it('should be the result of a custom option request', async () => {
    const result = await initRequest({
      host: '',
      accountId: '213',
      accessSecretKey: '5556123',
      accessId: '58575729',
    })('https://www.bing.com/', {method: 'POST', body: '1'});

    assert(result.status === 200);
  });
});
