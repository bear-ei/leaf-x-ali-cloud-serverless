import * as assert from 'assert';
import {
  handleBetweenSql,
  handleEqualSql,
  handleNotEqualSql,
  handleSetQuerySql,
  handleWhere,
} from '../src/sql';

describe('test/sql.test.ts', () => {
  it('should handle equal SQL statements', async () => {
    const equalSql = handleEqualSql({a: 'b'});
    const result = equalSql('a');

    assert(typeof result === 'object');
    assert(result['a = :a']['a'] === 'b');
  });

  it('should be processing not equal to SQL statement', async () => {
    const notEqualSql = handleNotEqualSql({notA: 'b'});
    const result = notEqualSql('notA');

    assert(typeof result === 'object');
    assert(result['a != :notA']['notA'] === 'b');
  });

  it('should be a query collection SQL statement', async () => {
    const setQuerySql = handleSetQuerySql({ids: ['b']});
    const result = setQuerySql('ids');

    assert(typeof result === 'object');
    assert(result['id IN (:...ids)']['ids'][0] === 'b');

    const setNullQuerySql = handleSetQuerySql({ids: []});
    const nullResult = setNullQuerySql('ids');

    assert(typeof nullResult === 'object');
    assert(!nullResult['id IN (:...ids)']['ids'][0]);
  });

  it('should handle SQL statements between ranges', async () => {
    const betweenSql = handleBetweenSql({timeRange: [123, 321]});
    const result = betweenSql('timeRange');

    assert(typeof result === 'object');
    assert(result['time BETWEEN :timeStart and :timeEnd']['timeStart'] === 123);
    assert(result['time BETWEEN :timeStart and :timeEnd']['timeEnd'] === 321);
  });

  it('should handle SQL statement splicing', async () => {
    const result = handleWhere('test', {
      'a = :a': {a: 'b'},
      'a != :notA': {notA: 'b'},
      'id IN (:...ids)': {ids: ['b']},
      'time BETWEEN :timeStart and :timeEnd': {timeStart: 123, timeEnd: 321},
    });

    assert(typeof result === 'object');
    assert(
      result['where'] ===
        'test.a = :a and test.a != :notA and test.id IN (:...ids) and test.time BETWEEN :timeStart and :timeEnd'
    );

    assert(
      JSON.stringify(result['value']) ===
        JSON.stringify({
          a: 'b',
          notA: 'b',
          ids: ['b'],
          timeStart: 123,
          timeEnd: 321,
        })
    );
  });
});
