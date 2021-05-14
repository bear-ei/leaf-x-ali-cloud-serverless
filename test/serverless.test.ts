import * as assert from 'assert';
import {serverless} from '../src/serverless';

describe('test/serverless.test.ts', () => {
  it('should be the result of the serverless default options', async () => {
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

  it('should be the result of the serverless customization options', async () => {
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

it('Should be the result of cc.', async () => {
  const {invoke: i} = serverless({
    accountId: '1513153060849486',
    accessId: 'LTAI4Fd5Chf5FFaQBCatShm3',
    accessSecretKey: '24GBZFnD1FL6a6vSpBcxnc2S3tPjDk',
    region: 'cn-shanghai',
    internal: false,
    qualifier: 'DEV',
    timeout: 1,
  });

  const result = await i({
    serviceName: 'ThalloAttendances',
    functionName: 'attendanceIndex',
    event: {
      type: 'GATEWAY',
      data: {
        httpMethod: 'GET',
        queryParameters: {isCount: false},
        pathParameters: {},
        headers: {'x-service': 'service'},
      },
    },
    async: false,
  }).catch(err => console.info(err));

  console.info(result);
});
