import * as assert from 'assert';
import {handleResponse} from '../src/response';

describe('test/response.test.ts', () => {
  it('should be an asynchronous response', async () => {
    const result = handleResponse('GATEWAY', {
      options: {},
      status: 202,
      data: '',
      headers: {'content-type': 'application/json; charset=utf-8'},
      statusText: '',
      url: '',
    });

    assert(typeof result === 'object');
    assert(result.status === 202);
    assert(result.data === '');
    assert(typeof result.headers === 'object');
    assert(
      result.headers['content-type'] === 'application/json; charset=utf-8'
    );
  });

  it('should be an API gateway response', async () => {
    const result = handleResponse('GATEWAY', {
      status: 200,
      options: {},
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

    assert(typeof result === 'object');
    assert(result.status === 200);
    assert((result.data as Record<string, unknown>).message === 'json');
    assert(typeof result.headers === 'object');
  });

  it('should be the response of the API gateway base64 encoded data', async () => {
    const result = handleResponse('GATEWAY', {
      status: 200,
      options: {},
      data: {
        statusCode: 200,
        body: Buffer.from('text').toString('base64'),
        isBase64Encoded: true,
        headers: {
          'content-type': 'application/text',
        },
      },
      headers: {'content-type': 'application/json; charset=utf-8'},
      statusText: '',
      url: '',
    });

    assert(typeof result === 'object');
    assert(result.status === 200);
    assert(result.data === 'text');
    assert(typeof result.headers === 'object');
  });

  it('should be an API gateway error response', async () => {
    try {
      handleResponse('GATEWAY', {
        options: {},
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
    } catch (error) {
      const err = error as Record<string, unknown>;

      assert(typeof error === 'object');
      assert(err.statusCode === 400);
      assert(err.message === 'Bad Request.');
    }
  });

  it('should be a response of the API gateway No Response headers content type', async () => {
    const result = handleResponse('GATEWAY', {
      options: {},
      status: 200,
      data: {
        statusCode: 200,
        body: JSON.stringify({message: 'json'}),
        isBase64Encoded: false,
        headers: {},
      },
      headers: {'content-type': 'application/json; charset=utf-8'},
      statusText: '',
      url: '',
    });

    assert(typeof result === 'object');
    assert(result.status === 200);
    assert(typeof result.data === 'string');
    assert(typeof result.headers === 'object');
  });
});
