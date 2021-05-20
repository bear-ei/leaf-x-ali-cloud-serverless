import * as fetch from '@leaf-x/fetch';
import * as assert from 'assert';
import * as sinon from 'sinon';
import {initInvoke} from '../src/invoke';

describe('test/invoke.test.ts', () => {
  it('should be invoke asynchronously', async () => {
    sinon.stub(fetch, 'fetch').resolves({
      status: 202,
      data: '',
      headers: {},
      statusText: '',
      url: '',
    });

    await initInvoke({
      qualifier: 'PROD',
      endpoint: 'https://leaf-x.app',
      version: '2016-10-17',
      host: 'github.com',
      accountId: '1235555677',
      accessId: 'aHR0cHM6Ly9naXRodWIuY29tLw==',
      accessSecretKey: 'MTIzNTU1NTY3Nw==',
      timeout: 3000,
    })({
      serviceName: 'leaf-x@snowflake',
      functionName: 'snowflake',
      async: true,
      event: {
        type: 'GATEWAY',
        data: {queryParameters: {name: 'snowflake'}},
      },
    }).then(result => {
      sinon.restore();

      assert(typeof result === 'object');
      assert(result.status === 202);
      assert(result.data === '');
      assert(typeof result.headers === 'object');
    });
  });

  it('should be invoke correctly', async () => {
    sinon.stub(fetch, 'fetch').resolves({
      status: 200,
      data: {
        statusCode: 200,
        body: JSON.stringify({message: 'json'}),
        isBase64Encoded: false,
        headers: {
          'content-type': 'application/json; charset=utf-8',
        },
      },
      headers: {'content-type': 'application/json; charset=utf-8'},
      statusText: '',
      url: '',
    });

    await initInvoke({
      qualifier: 'PROD',
      endpoint: 'https://leaf-x.app',
      version: '2016-10-17',
      host: 'github.com',
      accountId: '1235555677',
      accessId: 'aHR0cHM6Ly9naXRodWIuY29tLw==',
      accessSecretKey: 'MTIzNTU1NTY3Nw==',
      timeout: 3000,
    })({
      serviceName: 'leaf-x@snowflake',
      functionName: 'snowflake',
      event: {
        type: 'GATEWAY',
        data: {queryParameters: {name: 'snowflake'}},
      },
    }).then(result => {
      sinon.restore();

      assert(typeof result === 'object');
      assert(result.status === 200);
      assert((result.data as Record<string, unknown>).message === 'json');
      assert(typeof result.headers === 'object');
    });
  });

  it('should be an error invoke', async () => {
    sinon.stub(fetch, 'fetch').resolves({
      status: 200,
      data: {
        statusCode: 400,
        body: JSON.stringify({statusCode: 400, message: 'Bad Request.'}),
        isBase64Encoded: false,
        headers: {
          'content-type': 'application/json; charset=utf-8',
        },
      },
      headers: {'content-type': 'application/json; charset=utf-8'},
      statusText: '',
      url: '',
    });

    await initInvoke({
      qualifier: 'PROD',
      endpoint: 'https://leaf-x.app',
      version: '2016-10-17',
      host: 'github.com',
      accountId: '1235555677',
      accessId: 'aHR0cHM6Ly9naXRodWIuY29tLw==',
      accessSecretKey: 'MTIzNTU1NTY3Nw==',
      timeout: 3000,
    })({
      serviceName: 'leaf-x@snowflake',
      functionName: 'snowflake',
      event: {
        type: 'GATEWAY',
        data: {queryParameters: {name: 'snowflake'}},
      },
    }).catch(error => {
      sinon.restore();

      assert(typeof error === 'object');
      assert(error.statusCode === 400);
      assert(error.message === 'Bad Request.');
    });
  });

  it('should be a response error', async () => {
    sinon.stub(fetch, 'fetch').rejects({
      status: 404,
      data: {ErrorMessage: 'Bad Request.'},
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'x-fc-request-id': '87af2ed2-5205-4a13-9ee1-90ceaf51eee3',
      },
      statusText: '',
      url: '',
    });

    await initInvoke({
      qualifier: 'PROD',
      endpoint: 'https://leaf-x.app',
      version: '2016-10-17',
      host: 'github.com',
      accountId: '1235555677',
      accessId: 'aHR0cHM6Ly9naXRodWIuY29tLw==',
      accessSecretKey: 'MTIzNTU1NTY3Nw==',
      timeout: 3000,
    })({
      serviceName: 'leaf-x@snowflake',
      functionName: 'snowflake',
      event: {
        type: 'GATEWAY',
        data: {queryParameters: {name: 'snowflake'}},
      },
    }).catch(error => {
      sinon.restore();

      assert(typeof error === 'object');
      assert(error.status === 404);
      assert(error.code === 404);
    });
  });

  it('should be a invoke timeout', async () => {
    sinon.stub(fetch, 'fetch').rejects({
      message: {ErrorMessage: 'Bad Request.'},
    });

    await initInvoke({
      qualifier: 'PROD',
      endpoint: 'https://leaf-x.app',
      version: '2016-10-17',
      host: 'github.com',
      accountId: '1235555677',
      accessId: 'aHR0cHM6Ly9naXRodWIuY29tLw==',
      accessSecretKey: 'MTIzNTU1NTY3Nw==',
      timeout: 3000,
    })({
      serviceName: 'leaf-x@snowflake',
      functionName: 'snowflake',
      event: {
        type: 'GATEWAY',
        data: {queryParameters: {name: 'snowflake'}},
      },
    }).catch(error => {
      sinon.restore();

      assert(typeof error === 'object');
      assert(error.status === 500);
      assert(error.code === 500);
    });
  });
});
