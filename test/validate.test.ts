import * as assert from 'assert';
import {IsDefined, IsNumberString} from 'class-validator';
import {
  DeleteOptions,
  handleBooleanString,
  handleLanguageFormat,
  handleSet,
  handleValidate,
  HeadersOptions,
  IndexOptions,
  PathParamsOptions,
} from '../src/validate';

describe('test/validate.test.ts', () => {
  it('should be a validation params', async () => {
    class Rule {
      @IsDefined()
      @IsNumberString()
      id!: string;
    }

    const result = handleValidate(Rule, {id: '123'});

    assert(typeof result === 'object');
    assert(result['id'] === '123');

    const jsonStringResult = handleValidate(Rule, '{"id": "123"}');

    assert(typeof jsonStringResult === 'object');
    assert(jsonStringResult['id'] === '123');

    try {
      handleValidate(Rule, {id: 'abc'});
    } catch (error) {
      const err = error as Record<string, unknown>;

      assert(typeof err === 'object');
      assert(err['status'] === 422);
    }

    const indexResult = handleValidate(IndexOptions, {
      page: 1,
      size: 2,
      isCount: 'true',
      orderBy: 'ASC',
      id: '1',
      projectId: '1',
      ids: '1,2',
      notId: '3',
      notIds: '1,2,3',
    });

    assert(typeof indexResult === 'object');

    const deleteResult = handleValidate(DeleteOptions, {
      id: '1',
      ids: '1,2',
    });

    assert(typeof deleteResult === 'object');

    const pathResult = handleValidate(PathParamsOptions, {
      id: '1',
    });

    assert(typeof pathResult === 'object');

    const nullIndexResult = handleValidate(IndexOptions, {});

    assert(typeof nullIndexResult === 'object');

    const headersResult = handleValidate(HeadersOptions, {
      ip: '211.212.126.121',
      requestId: '19e3e7b5-e70a-458c-a9ca-742410fcdfdc',
      projectId: '1',
      clientNo: '1',
      authorization: '1',
    });

    assert(typeof headersResult === 'object');
  });

  it('should handle boolean string', async () => {
    const result = handleBooleanString('true');

    assert(typeof result === 'boolean');
    assert(result);

    const booleanResult = handleBooleanString(false);

    assert(typeof booleanResult === 'boolean');
    assert(!booleanResult);
  });

  it('should handle set', async () => {
    const result = handleSet('123,123');

    assert(Array.isArray(result));
  });

  it('should handle language format', async () => {
    const result = handleLanguageFormat('zh-cn');

    assert(result === 'ZH_CN');
  });
});
