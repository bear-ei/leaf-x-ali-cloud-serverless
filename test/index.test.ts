'use strict'

import * as _ from 'ramda'
import * as assert from 'assert'
import {
  validateId,
  newTimestamp,
  nextMillisecond,
  isNextMillisecond,
  generateId,
  snowflake,
  handleError,
  clockBack,
  timestampEqual
} from '../src'

describe('test/snowflake.test.ts', () => {
  it('Should be the result of validateId', async () => {
    const result = validateId({
      id: BigInt(3),
      maxId: BigInt(2),
      errorMessage:
        'Data center id can not be greater than ${maxId} or less than 0.'
    })

    assert(
      result === 'Data center id can not be greater than 2 or less than 0.'
    )
  })

  it('Should be the result of clockBack', async () => {
    const result = clockBack(BigInt(1), BigInt(2))

    assert(result === 'Clock moves backwards to reject the id generated for 1.')
  })

  it('Should be the result of timestampEqual', async () => {
    const results = timestampEqual({
      timestamp: BigInt(1),
      lastTimestamp: BigInt(1),
      sequence: BigInt(0),
      maxSequence: BigInt(0)
    })

    assert(typeof results === 'object')
    assert(typeof results.sequence === 'bigint')
    assert(typeof results.timestamp === 'bigint')
  })

  it('Should be the result of isNextMillisecond', async () => {
    const results = isNextMillisecond({
      timestamp: BigInt(1),
      lastTimestamp: BigInt(1),
      sequence: BigInt(0),
      maxSequence: BigInt(0)
    })

    assert(typeof results === 'object')
    assert(typeof results.sequence === 'bigint')
    assert(typeof results.timestamp === 'bigint')
  })

  it('Should be the result of nextMillisecond', async () => {
    const now = BigInt(Date.now())
    const result = nextMillisecond(now, now)

    assert(typeof result === 'bigint')
  })

  it('Should be the result of newTimestamp', async () => {
    const result = newTimestamp()

    assert(typeof result === 'bigint')
  })

  it('Should be the result of generateId', async () => {
    const results = generateId(
      {
        twEpoch: BigInt(1583734327332),
        timestampLeftShift: BigInt(22),
        dataCenterId: BigInt(0),
        dataCenterLeftShift: BigInt(17),
        workerId: BigInt(0),
        workerLeftShift: BigInt(12)
      },
      { timestamp: BigInt(1609430400000), sequence: BigInt(0) }
    )

    assert(typeof results === 'object')
    assert(typeof results.id === 'bigint')
    assert(typeof results.lastTimestamp === 'bigint')
    assert(typeof results.sequence === 'bigint')
  })

  it('Should be the result of error', async () => {
    try {
      handleError('error')
    } catch (error) {
      assert(error.message === 'error')
    }
  })

  it('Should be the result of snowflake', async () => {
    const generateId = snowflake({
      twEpoch: 1577808000000
    })

    const ids = _.compose(
      _.uniq,
      _.map(() => generateId())
    )

    assert(_.compose(_.length, ids)([...new Array(200000).keys()]) === 200000)
  })
})
