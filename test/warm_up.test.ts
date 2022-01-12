import * as assert from 'assert';
import * as sinon from 'sinon';
import * as invoke from '../src/invoke';
import {initWarmUp} from '../src/warm_up';

describe('test/warmUp.test.ts', () => {
  it('should be a successful warm-up', async () => {
    sinon.stub(invoke, 'initInvoke').returns(async () => ({
      data: '',
      status: 200,
      headers: {'content-type': 'application/json; charset=utf-8'},
    }));

    const warmUp = initWarmUp({
      qualifier: 'PROD',
      endpoint: 'https://leaf-x.com',
      version: '2016-10-17',
      host: 'github.com',
      accountId: '1235555677',
      accessId: 'aHR0cHM6Ly9naXRodWIuY29tLw==',
      accessSecretKey: 'MTIzNTU1NTY3Nw==',
      timeout: 3000,
    });

    await warmUp('leaf-x@snowflake', [
      {type: 'GATEWAY', functionName: 'snowflake'},
      {type: 'GATEWAY', functionName: 'snowflakeIndex'},
    ]).then(result => {
      sinon.restore();

      assert(Array.isArray(result));
      assert(
        result.some(item => {
          const {status, data, headers} = item;

          return status === 200 && data === '' && typeof headers === 'object';
        })
      );
    });
  });

  it('should be a failure to warm-up', async () => {
    sinon.stub(invoke, 'initInvoke').returns(async () => {
      throw Object.assign(new Error('Invalid invoke'), {
        code: 4000000,
        status: 400,
        message: 'Bad Request.',
      });
    });

    const warmUp = initWarmUp({
      qualifier: 'PROD',
      endpoint: 'https://leaf-x.com',
      version: '2016-10-17',
      host: 'github.com',
      accountId: '1235555677',
      accessId: 'aHR0cHM6Ly9naXRodWIuY29tLw==',
      accessSecretKey: 'MTIzNTU1NTY3Nw==',
      timeout: 3000,
    });

    await warmUp('leaf-x@snowflake', [
      {type: 'GATEWAY', functionName: 'snowflake'},
      {type: 'GATEWAY', functionName: 'snowflakeIndex'},
    ]).then(result => {
      sinon.restore();

      assert(Array.isArray(result));
      assert(
        result.some(item => {
          const {status, code, message} = item;

          return (
            status === 400 && code === 4000000 && message === 'Bad Request.'
          );
        })
      );
    });
  });
});
