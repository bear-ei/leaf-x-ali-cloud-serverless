import * as assert from 'assert';
import {serverless} from '../src/serverless';

describe('test/serverless.test.ts', () => {
  it('should be the default options serverless', async () => {
    const result = serverless({
      accountId: '1234455',
      accessId: 'MTIzNDQ1NQ==',
      accessSecretKey: 'MTIzMjEz',
      region: 'cn-shanghai',
    });

    assert(typeof result === 'object');
    assert(typeof result.invoke === 'function');
    assert(typeof result.warmUp === 'function');
  });

  it('should be the custom options serverless', async () => {
    const result = serverless({
      accountId: '1234455',
      accessId: 'MTIzMjEzMTQ1NQ==',
      accessSecretKey: 'MTIzNTg5MA==',
      region: 'cn-shanghai',
      timeout: 3000,
      version: '2016-08-15',
      qualifier: 'PROD',
      internal: false,
      secure: false,
    });

    assert(typeof result === 'object');
    assert(typeof result.invoke === 'function');
    assert(typeof result.warmUp === 'function');
  });
});
