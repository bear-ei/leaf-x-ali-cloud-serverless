import * as classTransformer from 'class-transformer';
import {validateSync} from 'class-validator';

/**
 * Validate the request parameters.
 *
 * @param rule Validation rules.
 * @param options Validate the parameter options.
 */
export const validate = <T, P>(rule: new () => T, options: P) => {
  const relOptions =
    typeof options === 'string' ? JSON.parse(options) : options;

  const data = classTransformer.plainToInstance(rule, relOptions);
  const result = validateSync(data as Record<string, unknown>, {
    skipMissingProperties: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  if (result.length !== 0) {
    throw Object.assign(new Error('Parameter validation errors.'), {
      status: 422,
      code: 422000,
      details: result,
    });
  }

  return data;
};
