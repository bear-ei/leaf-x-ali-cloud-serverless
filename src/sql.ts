/**
 * Sql type.
 */
type SqlType = typeof relSql & {
  where: typeof handleWhere;
  select: typeof handleSelect;
};

/**
 * Handle SQL select options.
 */
export interface HandleSelectOptions {
  /**
   * Creates SELECT query. Replaces all previous selections if they exist.
   */
  select?: string[];

  /**
   * Table name prefix.
   */
  prefix: string;
}

/**
 * Handle equal SQL statements.
 *
 * @param options SQL statement options.
 */
const handleEqualSql = (options: Record<string, unknown>) => (key: string) => ({
  [`${key} = :${key}`]: {[key]: options[key]},
});

/**
 * Handle unequal SQL statements.
 *
 * @param options SQL statement options.
 */
const handleNotEqualSql =
  (options: Record<string, unknown>) => (key: string) => {
    const field = key.replace(/not./g, k => k.toLowerCase()[k.length - 1]);

    return {[`${field} != :${key}`]: {[key]: options[key]}};
  };

/**
 * SQl statements that handle aggregate queries.
 *
 * @param options SQL statement options.
 */
const handleSetQuerySql =
  (options: Record<string, unknown>) => (key: string) => {
    const field = key.substring(0, key.length - 1);
    const value = options[key] as unknown[];

    return {
      [`${field} IN (:...${key})`]: {
        [key]: value?.length !== 0 ? [...new Set(value)] : [],
      },
    };
  };

/**
 * Handle queries between ranges of SQL statements.
 *
 * @param options SQL statement options.
 */
const handleBetweenSql =
  (options: Record<string, unknown>) => (key: string) => {
    const field = key.replace(/Range/, '');
    const value = options[key] as unknown[];

    return {
      [`${field} BETWEEN :${field}Start and :${field}End`]: {
        [`${field}Start`]: value[0],
        [`${field}End`]: value[1],
      },
    };
  };

/**
 * Handle SQL statement splicing.
 *
 * @param prefix Query prefix.
 * @param options SQL statement options.
 */
const handleWhere = (
  prefix: string,
  options: Record<string, Record<string, unknown>>
) => {
  const keys = Object.keys(options);
  const whereString = keys.map(key => `${prefix}.${key}`).join(' and ');
  const value = keys
    .map(key => options[key])
    .reduce((a, b) => ({...a, ...b}), {});

  return {where: whereString, whereValue: value};
};

/**
 * Handle SQL select options.
 *
 * @param entity Data entity.
 * @param options Handle SQL select options.
 */
const handleSelect = <T>(
  entity: new () => T,
  {select, prefix}: HandleSelectOptions
) =>
  select
    ? select.map(key => `${prefix}.${key}`)
    : Object.keys(new entity()).map(key => `${prefix}.${key}`);

/**
 * Handle sql.
 *
 * @param options SQL statement options.
 */
const relSql = (options: Record<string, unknown>) =>
  Object.freeze({
    equal: handleEqualSql(options),
    notEqual: handleNotEqualSql(options),
    set: handleSetQuerySql(options),
    between: handleBetweenSql(options),
  });

/**
 * Define the where function.
 */
Object.defineProperty(relSql, 'where', {value: handleWhere});

/**
 * Define the select function.
 */
Object.defineProperty(relSql, 'select', {value: handleSelect});

export const sql = relSql as SqlType;
