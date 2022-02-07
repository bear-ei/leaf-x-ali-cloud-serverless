import * as assert from 'assert';
import {IsDefined, IsNumberString} from 'class-validator';
import {validate} from '../src/validate';

describe('test/validate.test.ts', () => {
  it('should be a validation parameter', async () => {
    class Rule {
      @IsDefined()
      @IsNumberString()
      id!: string;
    }

    const result = validate(Rule, {id: '123'});

    assert(typeof result === 'object');
    assert(result['id'] === '123');

    const jsonStringResult = validate(Rule, '{"id": "123"}');

    assert(typeof jsonStringResult === 'object');
    assert(jsonStringResult['id'] === '123');

    try {
      validate(Rule, {id: 'abc'});
    } catch (error) {
      const err = error as Record<string, unknown>;

      assert(typeof err === 'object');
      assert(err['status'] === 422);
    }
  });
});
