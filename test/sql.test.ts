import * as assert from 'assert';
import {isArray} from 'class-validator';
import {sql} from '../src/sql';

describe('test/sql.test.ts', () => {
  it('should handle equal SQL statements', async () => {
    const {equal} = sql({a: 'b'});
    const result = equal('a');

    assert(typeof result === 'object');
    assert(result['a = :a']['a'] === 'b');
  });

  it('should be processing not equal to SQL statement', async () => {
    const {notEqual} = sql({notA: 'b'});
    const result = notEqual('notA');

    assert(typeof result === 'object');
    assert(result['a != :notA']['notA'] === 'b');
  });

  it('should be a query collection SQL statement', async () => {
    const {set} = sql({ids: ['b']});
    const result = set('ids');

    assert(typeof result === 'object');
    assert(result['id IN (:...ids)']['ids'][0] === 'b');

    const {set: setNull} = sql({ids: []});
    const nullResult = setNull('ids');

    assert(typeof nullResult === 'object');
    assert(!nullResult['id IN (:...ids)']['ids'][0]);
  });

  it('should handle SQL statements between ranges', async () => {
    const {between} = sql({timeRange: [123, 321]});
    const result = between('timeRange');

    assert(typeof result === 'object');
    assert(result['time BETWEEN :timeStart and :timeEnd']['timeStart'] === 123);
    assert(result['time BETWEEN :timeStart and :timeEnd']['timeEnd'] === 321);
  });

  it('should handle SQL statement splicing', async () => {
    const result = sql.where('test', {
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
      JSON.stringify(result['whereValue']) ===
        JSON.stringify({
          a: 'b',
          notA: 'b',
          ids: ['b'],
          timeStart: 123,
          timeEnd: 321,
        })
    );
  });

  it('should handle SQL select', async () => {
    class Entity {
      a!: string;
    }

    const result = sql.select(Entity, {
      select: ['a'],
      prefix: 'test',
    });

    assert(isArray(result));
    assert(result[0] === 'test.a');

    const entityResult = sql.select(Entity, {
      select: ['a'],
      prefix: 'test',
    });

    assert(isArray(entityResult));
    assert(entityResult[0] === 'test.a');
  });
});
