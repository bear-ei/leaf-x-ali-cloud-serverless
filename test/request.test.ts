import * as assert from 'assert';
import {request} from '../src/request';

describe('test/request.test.ts', () => {
  it('should be the result of response status 200', async () => {
    const result = await request('https://www.bing.com');

    assert(result.status === 200);
  });
});
