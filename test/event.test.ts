import * as assert from 'assert';
import {handleTriggerEvent} from '../src/event';

describe('test/event.test.ts', () => {
  it('should be the API gateway default event', async () => {
    const result = handleTriggerEvent('GATEWAY', {});

    assert(typeof result === 'object');
    assert(result.httpMethod === 'GET');
    assert(result.isBase64Encoded === false);
    assert(typeof result.queryParameters === 'object');
    assert(typeof result.pathParameters === 'object');
    assert(!result.body);
    assert(typeof result.headers === 'object');
    assert(
      result.headers['content-type'] === 'application/json; charset=utf-8'
    );
    assert(result.headers['accept'] === '*/*');
  });

  it('should be the correct event for the API gateway', async () => {
    const result = handleTriggerEvent('GATEWAY', {
      headers: {
        'content-type': 'application/text',
        accept: 'application/text',
      },
      body: 'data',
    });

    assert(typeof result === 'object');
    assert(result.httpMethod === 'GET');
    assert(result.isBase64Encoded === false);
    assert(typeof result.queryParameters === 'object');
    assert(typeof result.pathParameters === 'object');
    assert(result.body === Buffer.from('data').toString('base64'));
    assert(typeof result.headers === 'object');
    assert(result.headers['content-type'] === 'application/text');
    assert(result.headers['accept'] === 'application/text');
  });
});
