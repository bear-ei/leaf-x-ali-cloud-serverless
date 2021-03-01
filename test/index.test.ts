// 'use strict'

// import * as _ from 'ramda'
// import * as sinon from 'sinon'
// import * as assert from 'assert'
// import axios from 'axios'
// import * as client from '../src'
// import * as util from '../src/util'
// import {
//   ErrorDataResult,
//   InvokeOptions,
//   InvokeResult,
//   RequestOptions
// } from 'src/interface'

// const { fc, invoke, request, errorData, response, warmUp } = client

// describe('test/util.test.ts', () => {
//   it('Should be the result of fc.', async () => {
//     const defaultOptions = () => {
//       const result = fc({
//         accessId: 'test',
//         accountId: 'test',
//         accessSecretKey: 'test',
//         region: 'shanghai'
//       })

//       assert(_.is(Object, result.invoke))
//       assert(_.is(Object, result.warmUp))
//     }

//     const inputOptions = () => {
//       const result = fc({
//         accessId: 'test',
//         accountId: 'test',
//         accessSecretKey: 'test',
//         region: 'shanghai',
//         timeout: 3000,
//         internal: false,
//         secure: true
//       })

//       assert(_.is(Object, result.invoke))
//       assert(_.is(Object, result.warmUp))
//     }

//     defaultOptions()
//     inputOptions()
//   })

//   it('Should be the result of invoke.', async () => {
//     const config = {
//       accountId: 'test',
//       host: 'test.shanghai.fc.aliyuncs.com',
//       timeout: 3000,
//       qualifier: 'LATEST',
//       version: '2016-08-15',
//       endpoint: 'http://test.shanghai.fc.aliyuncs.com',
//       accessId: 'test',
//       accessSecretKey: 'test'
//     }

//     const options = ({
//       serviceName: 'test',
//       functionName: 'test',
//       event: {
//         httpMethod: 'POST',
//         isBase64Encoded: false,
//         queryParameters: {},
//         pathParameters: {},
//         body: {},
//         headers: {}
//       },
//       isAsync: false
//     } as unknown) as InvokeOptions

//     const response = {
//       status: 200,
//       data: {
//         statusCode: 200,
//         isBase64Encoded: false,
//         headers: { 'content-type': 'application/json; charset=utf-8' },
//         body: { message: 'ok' }
//       },
//       headers: { 'content-type': 'application/json; charset=utf-8' }
//     }

//     const error = {
//       status: 500,
//       data: 'error',
//       headers: { 'content-type': 'application/json; charset=utf-8' }
//     }

//     const correctResponse = async () => {
//       sinon.stub(client, 'request').resolves({
//         status: 200,
//         data: {
//           statusCode: 200,
//           isBase64Encoded: false,
//           headers: { 'content-type': 'application/json; charset=utf-8' },
//           body: JSON.stringify({ message: 'ok' })
//         },
//         headers: { 'content-type': 'application/json; charset=utf-8' }
//       })

//       sinon.stub(client, 'response').returns(response)

//       const result = await invoke(config, options)

//       assert(_.equals(response, result))
//     }

//     const errorResponse = async () => {
//       sinon.restore()
//       sinon.stub(client, 'request').rejects(error)

//       try {
//         await invoke(config, options)
//       } catch (err) {
//         assert(_.equals(error, err))
//       }
//     }

//     await correctResponse()
//     await errorResponse()
//   })

//   it('Should be the result of request.', async () => {
//     const config = {
//       host: 'test.shanghai.fc.aliyuncs.com',
//       accountId: 'test',
//       accessId: 'test',
//       accessSecretKey: 'test',
//       timeout: 3000,
//       qualifier: 'LATEST'
//     }

//     const options = ({
//       url: 'http://test.shanghai.fc.aliyuncs.com',
//       event: {
//         pathParameters: {},
//         queryParameters: {},
//         httpMethod: 'GET'
//       },
//       isAsync: false,
//       serviceName: 'test',
//       functionName: 'test'
//     } as unknown) as RequestOptions

//     const response = {
//       status: 200,
//       data: {
//         statusCode: 200,
//         isBase64Encoded: false,
//         headers: { 'content-type': 'application/json; charset=utf-8' },
//         body: JSON.stringify({ message: 'ok' })
//       },
//       headers: { 'content-type': 'application/json; charset=utf-8' }
//     }

//     const error = {
//       status: 500,
//       code: 500000,
//       serviceName: 'test',
//       functionName: 'test',
//       requestId: '2ea48872-4f8a-4577-9afc-3b8969e960cd',
//       message: 'test test invoke failed.',
//       env: 'LATEST',
//       apis: [
//         {
//           serviceName: 'test',
//           functionName: 'test',
//           requestId: '2ea48872-4f8a-4577-9afc-3b8969e960cd',
//           env: 'LATEST'
//         }
//       ]
//     }

//     const mock = () => {
//       sinon.stub(util, 'eventToBuffer').returns(Buffer.from('test'))
//       sinon.stub(util, 'requestToken').returns('token')
//       sinon
//         .stub(util, 'requestHeaders')
//         .returns({ 'content-type': 'application/json; charset=utf-8' })
//     }

//     const correctResponse = async () => {
//       mock()

//       sinon.stub(axios, 'request').resolves(response)

//       const result = await request(config, options)

//       assert(_.equals(result, response))
//     }

//     const businessError = async () => {
//       sinon.restore()
//       mock()

//       sinon.stub(client, 'errorData').returns(error)
//       sinon.stub(axios, 'request').rejects({
//         response: {
//           status: 500,
//           data: {
//             statusCode: 500,
//             isBase64Encoded: false,
//             headers: { 'content-type': 'application/json; charset=utf-8' },
//             body: JSON.stringify({ message: 'error' })
//           },
//           headers: {
//             'content-type': 'application/json; charset=utf-8',
//             'x-fc-request-id': '2ea48872-4f8a-4577-9afc-3b8969e960cd'
//           }
//         }
//       })

//       try {
//         await request(config, options)
//       } catch (err) {
//         assert(_.equals(error, err))
//       }
//     }

//     const serviceError = async () => {
//       sinon.restore()
//       mock()

//       sinon.stub(client, 'errorData').returns(error)
//       sinon.stub(axios, 'request').rejects({ code: 400 })

//       try {
//         await request(config, options)
//       } catch (err) {
//         assert(_.equals(error, err))
//       }
//     }

//     await correctResponse()
//     await businessError()
//     await serviceError()
//   })

//   it('Should be the result of errorData.', async () => {
//     const options = {
//       serviceName: 'snowflake',
//       functionName: 'snowflakeIndex',
//       requestId: '6cd98939-314c-4404-befc-d18e3b854ce7'
//     }

//     const businessError = () => {
//       const result = errorData(
//         { env: 'DEV', ...options },
//         {
//           status: 401,
//           code: 401000,
//           message: 'Unauthorized',
//           details: { message: '401' },
//           apis: [
//             {
//               serviceName: 'snowflake',
//               functionName: 'snowflakeIndex',
//               requestId: '6cd98939-314c-4404-befc-d18e3b854ce7',
//               env: 'DEV'
//             }
//           ]
//         }
//       )

//       assert(result.status === 401)
//       assert(result.code === 401000)
//       assert(result.message === 'Unauthorized')
//       assert(result.serviceName === 'snowflake')
//       assert(result.functionName === 'snowflakeIndex')
//       assert(result.env === 'DEV')
//       assert(_.is(Object, result.details))
//       assert(_.is(Array, result.apis))
//     }

//     const prodServiceError = () => {
//       const result = errorData({ env: 'PROD', ...options }, { error: 'error' })

//       assert(result.message === 'snowflake snowflakeIndex invoke failed.')
//       assert(result.status === 500)
//       assert(result.code === 500000)
//       assert(result.serviceName === 'snowflake')
//       assert(result.functionName === 'snowflakeIndex')
//       assert(result.env === 'PROD')

//       assert(_.is(Array, result.apis))
//     }

//     const devServiceError = () => {
//       const result = errorData({ env: 'DEV', ...options }, { error: 'error' })

//       assert(result.message === 'snowflake snowflakeIndex invoke failed.')
//       assert(result.status === 500)
//       assert(result.code === 500000)
//       assert(result.serviceName === 'snowflake')
//       assert(result.functionName === 'snowflakeIndex')
//       assert(result.env === 'DEV')
//       assert(_.is(Object, result.details))
//       assert(_.is(Array, result.apis))
//     }

//     const generateInvokeChain = () => {
//       const result = errorData(
//         { env: 'DEV', ...options },
//         {
//           status: 401,
//           code: 401000,
//           message: 'Unauthorized',
//           details: { message: '401' }
//         }
//       )

//       assert(result.status === 401)
//       assert(result.code === 401000)
//       assert(result.message === 'Unauthorized')
//       assert(result.serviceName === 'snowflake')
//       assert(result.functionName === 'snowflakeIndex')
//       assert(result.env === 'DEV')
//       assert(_.is(Object, result.details))
//       assert(_.is(Array, result.apis))
//     }

//     businessError()
//     prodServiceError()
//     devServiceError()
//     generateInvokeChain()
//   })

//   it('Should be the result of response.', async () => {
//     const correctResponse = () => {
//       const result = response({
//         status: 200,
//         data: {
//           statusCode: 200,
//           isBase64Encoded: false,
//           headers: { 'content-type': 'application/json; charset=utf-8' },
//           body: JSON.stringify({ message: 'ok' })
//         },
//         headers: { 'content-type': 'application/json; charset=utf-8' }
//       })

//       assert(
//         _.equals(result, {
//           status: 200,
//           data: { message: 'ok' },
//           headers: { 'content-type': 'application/json; charset=utf-8' }
//         })
//       )
//     }

//     const errorResponse = () => {
//       try {
//         response({
//           status: 400,
//           data: {
//             statusCode: 400,
//             isBase64Encoded: false,
//             headers: { 'content-type': 'application/json; charset=utf-8' },
//             body: JSON.stringify({
//               status: 400,
//               code: 400000,
//               message: `error.`
//             })
//           },
//           headers: { 'content-type': 'application/json; charset=utf-8' }
//         })
//       } catch (err) {
//         assert(_.equals(err, { status: 400, code: 400000, message: `error.` }))
//       }
//     }

//     const isAliCloudGatewayData = () => {
//       const result = response({
//         status: 200,
//         data: {
//           statusCode: 200,
//           isBase64Encoded: false,
//           headers: { 'content-type': 'text/plain; charset=utf-8' },
//           body: ''
//         },
//         headers: { 'content-type': 'application/json; charset=utf-8' }
//       })

//       assert(
//         _.equals(result, {
//           status: 200,
//           data: '',
//           headers: { 'content-type': 'text/plain; charset=utf-8' }
//         })
//       )
//     }

//     const isAliCloudGatewayJsonData = () => {
//       const result = response({
//         status: 200,
//         data: '',
//         headers: { 'content-type': 'application/json; charset=utf-8' }
//       })

//       assert(
//         _.equals(result, {
//           status: 200,
//           data: '',
//           headers: { 'content-type': 'application/json; charset=utf-8' }
//         })
//       )
//     }

//     correctResponse()
//     errorResponse()
//     isAliCloudGatewayData()
//     isAliCloudGatewayJsonData()
//   })

//   it('Should be the result of warmUp.', async () => {
//     const config = {
//       accountId: 'test',
//       host: 'test.shanghai.fc.aliyuncs.com',
//       timeout: 3000,
//       qualifier: 'LATEST',
//       version: '2016-08-15',
//       endpoint: 'http://test.shanghai.fc.aliyuncs.com',
//       accessId: 'test',
//       accessSecretKey: 'test'
//     }

//     const options = { serviceName: 'test', functionNames: ['test1', 'test2'] }
//     const correctResponse = async () => {
//       sinon.stub(client, 'invoke').resolves({
//         status: 200,
//         data: {
//           statusCode: 201,
//           isBase64Encoded: false,
//           headers: { 'content-type': 'application/json; charset=utf-8' },
//           body: JSON.stringify({ message: 'ok' })
//         },
//         headers: { 'content-type': 'application/json; charset=utf-8' }
//       })

//       const result = await warmUp(config, options)

//       assert(_.length(result) !== 0)
//       assert(
//         _.equals(
//           _.map(({ status }: InvokeResult) => status)(result as InvokeResult[]),
//           [200, 200]
//         )
//       )
//     }

//     const businessErrorResponse = async () => {
//       sinon.restore()
//       sinon.stub(client, 'invoke').rejects({
//         status: 400,
//         data: {
//           statusCode: 400,
//           isBase64Encoded: false,
//           headers: { 'content-type': 'application/json; charset=utf-8' },
//           body: JSON.stringify({ message: 'error' })
//         },
//         headers: { 'content-type': 'application/json; charset=utf-8' }
//       })
//       const result = await warmUp(config, options)

//       assert(_.length(result) !== 0)
//       assert(
//         _.equals(
//           _.map(({ status }: ErrorDataResult) => status)(
//             result as ErrorDataResult[]
//           ),
//           [400, 400]
//         )
//       )
//     }

//     await correctResponse()
//     await businessErrorResponse()
//   })
// })
