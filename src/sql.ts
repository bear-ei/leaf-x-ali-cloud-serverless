/**
 * Handle equal SQL statements.
 *
 * @param options Sql statement options.
 */
export const handleEqualSql =
  (options: Record<string, unknown>) => (key: string) => ({
    [`${key} = :${key}`]: {[key]: options[key]},
  });

/**
 * Handle unequal SQL statements.
 *
 * @param options Sql statement options.
 */
export const handleNotEqualSql =
  (options: Record<string, unknown>) => (key: string) => {
    const field = key.replace(/not./g, k => k.toLowerCase()[k.length - 1]);

    return {[`${field} != :${key}`]: {[key]: options[key]}};
  };

/**
 * SQl statements that handle aggregate queries.
 *
 * @param options Sql statement options.
 */
export const handleSetQuerySql =
  (options: Record<string, unknown[]>) => (key: string) => {
    const field = key.substring(0, key.length - 1);

    return {
      [`${field} IN (:...${key})`]: {
        [key]: options[key]?.length !== 0 ? [...new Set(options[key])] : [],
      },
    };
  };

/**
 * Handle queries between ranges of SQL statements.
 *
 * @param options Sql statement options.
 */
export const handleBetweenSql =
  (options: Record<string, unknown[]>) => (key: string) => {
    const field = key.replace(/Range/, '');

    return {
      [`${field} BETWEEN :${field}Start and :${field}End`]: {
        [`${field}Start`]: options[key][0],
        [`${field}End`]: options[key][1],
      },
    };
  };

/**
 * Handle SQL statement splicing.
 *
 * @param prefix Query prefix.
 * @param options Sql statement options.
 */
export const handleWhere = (
  prefix: string,
  options: Record<string, unknown>
) => {
  const keys = Object.keys(options);
  const whereString = keys.map(key => `${prefix}.${key}`).join(' and ');
  const value = keys
    .map(key => options[key])
    .reduce((a, b) => Object.assign(a, b), {});

  return {where: whereString, value};
};
