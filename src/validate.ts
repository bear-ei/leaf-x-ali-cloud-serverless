import * as classTransformer from 'class-transformer';
import {Transform} from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNumber,
  IsNumberString,
  Max,
  Min,
  ValidateIf,
  validateSync,
} from 'class-validator';

/**
 * Handle validate parameters type.
 */
type HandleValidateType = typeof relHandleValidate & {
  Index: typeof IndexOptions;
  Delete: typeof DeleteOptions;
  Path: typeof PathParametersOptions;
};

/**
 * Get data index options.
 */
export class IndexOptions {
  /**
   * Index paging page number.
   *
   * Default value is 1.
   */
  @Transform(({value}) => Number(value))
  @Min(1)
  @Max(1000)
  @IsNumber({allowNaN: false})
  page?: number;

  /**
   * Index paging size.
   *
   * Default value is 10.
   */
  @Transform(({value}) => Number(value))
  @Min(1)
  @Max(1000)
  @IsNumber({allowNaN: false})
  size?: number;

  /**
   * Whether to count the total .
   *
   * Default value is false.
   */
  @Transform(({value}) => (value === 'true' ? true : false))
  @IsBoolean()
  isCount?: boolean;

  /**
   * Index sorting method.
   *
   * Default value is ASC.
   */
  @IsEnum(['ASC', 'DESC'])
  orderBy?: 'ASC' | 'DESC';

  /**
   * Data ID.
   */
  @IsNumberString()
  id?: string;

  /**
   * Project ID.
   */
  @IsNumberString()
  projectId?: string;

  /**
   * Data id set.
   */
  @Transform(({value}) =>
    typeof value === 'string' ? value.split(',') : value
  )
  @ArrayMinSize(1)
  @ArrayMaxSize(1000)
  @IsNumberString({}, {each: true})
  ids?: string[] | string;

  /**
   * Is not equal to the data ID.
   */
  @IsNumberString()
  notId?: string;

  /**
   * Is not equal to the data ID set.
   */
  @Transform(({value}) =>
    typeof value === 'string' ? value.split(',') : value
  )
  @ArrayMinSize(1)
  @ArrayMaxSize(1000)
  @IsNumberString({}, {each: true})
  notIds?: string[] | string;
}

/**
 * Delete data options.
 */
export class DeleteOptions {
  /**
   * Data ID.
   */
  @ValidateIf(e => !e.ids)
  @IsDefined()
  @IsNumberString()
  id?: string;

  /**
   * Data id set.
   */
  @ValidateIf(e => !e.id)
  @IsDefined()
  @Transform(({value}) =>
    typeof value === 'string' ? value.split(',') : value
  )
  @ArrayMinSize(1)
  @ArrayMaxSize(1000)
  @IsNumberString({}, {each: true})
  ids?: string[] | string;
}

/**
 * Path parameter options.
 */
export class PathParametersOptions {
  /**
   * Data ID.
   */
  @IsDefined()
  @IsNumberString()
  id!: string;
}

/**
 * Handle validate parameters.
 *
 * @param rule Validation rules.
 * @param options Validate the parameter options.
 */
export const relHandleValidate = <T, P>(rule: new () => T, options: P) => {
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

Object.defineProperty(relHandleValidate, 'Index', {
  value: IndexOptions,
});

Object.defineProperty(relHandleValidate, 'Delete', {
  value: DeleteOptions,
});

Object.defineProperty(relHandleValidate, 'Path', {
  value: PathParametersOptions,
});

export const handleValidate = relHandleValidate as HandleValidateType;
