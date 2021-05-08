import * as assert from 'assert';
import {response} from '../src/response';

describe('test/response.test.ts', () => {
  it('should be the result of an asynchronous request response', async () => {
    const result = response({
      type: 'GATEWAY',
      response: {
        status: 202,
        data: '',
        headers: {'content-type': 'application/json; charset=utf-8'},
        statusText: '',
        url: '',
      },
    });

    assert(typeof result === 'object');
    assert(result.status === 202);
    assert(result.data === '');
    assert(typeof result.headers === 'object');
    assert(
      result.headers['content-type'] === 'application/json; charset=utf-8'
    );
  });

  it('should be the result of response to gateway event', async () => {
    const result = response({
      type: 'GATEWAY',
      response: {
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
      },
    });

    assert(typeof result === 'object');
    assert(result.status === 200);
    assert((result.data as Record<string, unknown>).message === 'json');
    assert(typeof result.headers === 'object');
  });

  it('should be the result of Base64 gateway event response', async () => {
    const result = response({
      type: 'GATEWAY',
      response: {
        status: 200,
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
      },
    });

    assert(typeof result === 'object');
    assert(result.status === 200);
    assert(result.data === 'text');
    assert(typeof result.headers === 'object');
  });

  it('should be the result of gateway event error response', async () => {
    try {
      response({
        type: 'GATEWAY',
        response: {
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
        },
      });
    } catch (error) {
      assert(typeof error === 'object');
      assert(error.statusCode === 400);
      assert(error.message === 'Bad Request.');
    }
  });

  it('should be the result of an unresponsive type of gateway event', async () => {
    const result = response({
      type: 'GATEWAY',
      response: {
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
      },
    });

    assert(typeof result === 'object');
    assert(result.status === 200);
    assert(typeof result.data === 'string');
    assert(typeof result.headers === 'object');
  });
});
