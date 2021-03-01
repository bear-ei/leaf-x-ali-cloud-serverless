'use strict'

import * as sinon from 'sinon'

import * as client from '../src'

const { fc } = client

describe('test/util.test.ts', () => {
  it('Should be the result of CCCCCC.', async () => {
    sinon.restore()

    const { invoke } = fc({
      accountId: '1513153060849486',
      accessId: 'LTAI4Fd5Chf5FFaQBCatShm3',
      accessSecretKey: '24GBZFnD1FL6a6vSpBcxnc2S3tPjDk',
      region: 'cn-shanghai',
      timeout: 20000,
      internal: false,
      qualifier: 'DEV'
    })

    const result = await invoke({
      serviceName: 'ThalloAttendances',
      functionName: 'attendanceIndex',
      event: {
        httpMethod: 'GET',
        queryParameters: {},
        pathParameters: {},
        headers: { 'x-service': 'service' }
      },
      isAsync: true
    }).catch((error) => console.info(error))

    // result

    console.info(result)
  })
})
