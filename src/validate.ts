import * as classTransformer from 'class-transformer';
import {Transform} from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsBoolean,
  IsDefined,
  IsEnum,
  IsIP,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
  ValidateIf,
  validateSync,
} from 'class-validator';
import {throwError} from './error';

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
  @Transform(({value}) => handleBooleanString(value))
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
  @Transform(({value}) => handleSet(value))
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
  @Transform(({value}) => handleSet(value))
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
  @Transform(({value}) => handleSet(value))
  @ArrayMinSize(1)
  @ArrayMaxSize(1000)
  @IsNumberString({}, {each: true})
  ids?: string[] | string;
}

/**
 * Path params options.
 */
export class PathParamsOptions {
  /**
   * Data ID.
   */
  @IsDefined()
  @IsNumberString()
  id!: string;
}

/**
 * Request headers options.
 */
export class HeadersOptions {
  /**
   * Client ip address.
   */
  @IsDefined()
  @IsIP()
  ip!: string;

  /**
   * Request ID.
   */
  @IsDefined()
  @IsUUID()
  requestId!: string;

  /**
   * Project ID.
   */
  @IsDefined()
  @IsNumberString()
  projectId!: string;

  /**
   * Client number.
   */
  @IsDefined()
  @IsNotEmpty()
  @Length(1, 20)
  @IsString()
  clientNo!: string;

  /**
   * Client authorization ID.
   */
  @IsDefined()
  @IsNumberString()
  authorization!: string;
}

/**
 * Handle boolean string.
 *
 * @param value A Boolean value or a Boolean string.
 */
export const handleBooleanString = (value: boolean | string) => {
  const isBooleanString = typeof value === 'string';

  if (!isBooleanString) {
    return value;
  }

  return value === 'true' ? true : false;
};

/**
 * Handle set.
 *
 * @param value A string of data or a string concatenated by ",".
 */
export const handleSet = (value: string[] | string) =>
  typeof value === 'string' ? value.split(',') : value;

/**
 * Handle validate params.
 *
 * @param rule Validation rules.
 * @param options Validate the params options.
 */
export const handleValidate = <T, P>(rule: new () => T, options: P) => {
  const relOptions =
    typeof options === 'string' ? JSON.parse(options) : options;

  const data = classTransformer.plainToInstance(rule, relOptions);
  const result = validateSync(data as Record<string, unknown>, {
    skipMissingProperties: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  result.length !== 0 &&
    throwError(
      {status: 422, code: 422000, details: result},
      'Params validation errors.'
    );

  return data;
};
