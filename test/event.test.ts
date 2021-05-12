import * as assert from 'assert';
import {handleEvent} from '../src/event';

describe('test/event.test.ts', () => {
  it('should be the result of a default gateway event', async () => {
    const result = handleEvent({type: 'GATEWAY', data: {}});

    assert(typeof result === 'object');
    assert(result.httpMethod === 'GET');
    assert(result.isBase64Encoded === false);
    assert(typeof result.queryParameters === 'object');
    assert(typeof result.pathParameters === 'object');
    assert(typeof result.body === 'string');
    assert(typeof result.headers === 'object');
    assert(
      result.headers['content-type'] === 'application/json; charset=utf-8'
    );
    assert(result.headers['accept'] === '*/*');
  });

  it('should be the result of a custom gateway event', async () => {
    const result = handleEvent({
      type: 'GATEWAY',
      data: {
        headers: {
          'content-type': 'application/text',
          accept: 'application/text',
        },
        body: 'data',
      },
    });

    assert(typeof result === 'object');
    assert(result.httpMethod === 'GET');
    assert(result.isBase64Encoded === false);
    assert(typeof result.queryParameters === 'object');
    assert(typeof result.pathParameters === 'object');
    assert(result.body === 'data');
    assert(typeof result.headers === 'object');
    assert(result.headers['content-type'] === 'application/text');
    assert(result.headers['accept'] === 'application/text');
  });
});
