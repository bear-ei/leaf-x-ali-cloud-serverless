'use strict'

import * as sinon from 'sinon'
// import axios from 'axios'
import * as client from '../src'

const { fc } = client

describe('test/util.test.ts', () => {
  it('Should be the result of CCCCCC.', async () => {
    sinon.restore()

    // const response = {
    //   status: 200,
    //   data: {
    //     statusCode: 200,
    //     isBase64Encoded: false,
    //     headers: { 'content-type': 'application/json; charset=utf-8' },
    //     body: JSON.stringify({ message: 'ok' })
    //   },
    //   headers: { 'content-type': 'application/json; charset=utf-8' }
    // }

    // sinon.stub(axios, 'request').resolves(response)

    const { invoke } = fc({
      accountId: '1513153060849486',
      accessId: 'LTAI4Fd5Chf5FFaQBCatShm3',
      accessSecretKey: '24GBZFnD1FL6a6vSpBcxnc2S3tPjDk',
      region: 'cn-shanghai',
      timeout: 20000,
      internal: false,
      qualifier: 'DEV'
    })

    console.time()

    const result = await invoke({
      serviceName: 'ThalloAttendances',
      functionName: 'attendanceIndex',
      event: {
        httpMethod: 'GET',
        queryParameters: { isCount: false },
        pathParameters: {},
        headers: { 'x-service': 'service' }
      },
      isAsync: false
    }).catch((error) => console.info(error))

    console.timeEnd()

    console.info(result)
  })
})
