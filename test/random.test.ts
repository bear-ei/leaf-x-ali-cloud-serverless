import * as assert from 'assert';
import {generateRandom} from '../src/random';

describe('test/random.test.ts', () => {
  it('should generate numbers of specified length', async () => {
    const result = generateRandom(8);

    assert(typeof result === 'number');
    assert(result.toString().length === 8);
  });
});
