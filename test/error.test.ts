import * as assert from 'assert';
import {handleError, initHandleServerlessError} from '../src/error';

describe('test/error.test.ts', () => {
  it('should be an internal service error', async () => {
    const result = handleError(
      {message: 'Internal service error.'},
      {
        serviceName: 'leaf-x@snowflake',
        functionName: 'snowflake',
        requestId: 'ee8890a1-a134-4bfb-83e5-b296d8bba1a7',
        env: 'PROD',
      }
    );

    assert(typeof result === 'object');
    assert(result.status === 500);
    assert(result.code === 500);
    assert(result.serviceName === 'leaf-x@snowflake');
    assert(result.functionName === 'snowflake');
    assert(result.requestId === 'ee8890a1-a134-4bfb-83e5-b296d8bba1a7');
    assert(result.message === 'Internal service error.');
    assert(result.env === 'PROD');
    assert(Array.isArray(result.apis));
    assert(typeof result.details === 'object');
  });

  it('should be a params validation error', async () => {
    const result = handleError(
      {
        status: 422,
        code: 422000,
        apis: [
          {
            serviceName: 'leaf-x@pay',
            functionName: 'pay',
            requestId: 'ee8890a1-a134-4bfb-83e5-b296d8bba1a8',
            env: 'PROD',
          },
        ],
      },
      {
        serviceName: 'leaf-x@snowflake',
        functionName: 'snowflake',
        requestId: 'ee8890a1-a134-4bfb-83e5-b296d8bba1a7',
        env: 'PROD',
      }
    );

    assert(typeof result === 'object');
    assert(result.status === 422);
    assert(result.code === 422000);
    assert(result.serviceName === 'leaf-x@snowflake');
    assert(result.functionName === 'snowflake');
    assert(result.requestId === 'ee8890a1-a134-4bfb-83e5-b296d8bba1a7');
    assert(result.message === 'leaf-x@snowflake snowflake invoke failed.');
    assert(result.env === 'PROD');
    assert(Array.isArray(result.apis));
  });

  it('should be a function invoke error', async () => {
    try {
      const handleServerlessError = initHandleServerlessError({
        serviceName: 'leaf-x@snowflake',
        functionName: 'snowflake',
        requestId: 'ee8890a1-a134-4bfb-83e5-b296d8bba1a7',
        env: 'PROD',
      });

      handleServerlessError({
        status: 422,
        code: 422000,
        apis: [
          {
            serviceName: 'leaf-x@pay',
            functionName: 'pay',
            requestId: 'ee8890a1-a134-4bfb-83e5-b296d8bba1a8',
            env: 'PROD',
          },
        ],
      });
    } catch (error) {
      const relError = error as Record<string, unknown>;

      assert(typeof error === 'object');
      assert(relError.status === 422);
      assert(relError.code === 422000);
      assert(relError.serviceName === 'leaf-x@snowflake');
      assert(relError.functionName === 'snowflake');
      assert(relError.requestId === 'ee8890a1-a134-4bfb-83e5-b296d8bba1a7');
      assert(relError.message === 'leaf-x@snowflake snowflake invoke failed.');
      assert(relError.env === 'PROD');
      assert(Array.isArray(relError.apis));
    }
  });
});
