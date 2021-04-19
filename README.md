# Serverless

Ali cloud serverless access.

## Installation

> npm install @leaf-x/ali-cloud-serverless --save

## Parameters

| Name            | Type    | Default Value | Description                                                                                                                  |
| :-------------- | :------ | :------------ | :--------------------------------------------------------------------------------------------------------------------------- |
| accountId       | String  | Required      | Ali cloud account id.                                                                                                        |
| accessId        | String  | Required      | Ali cloud access id.                                                                                                         |
| accessSecretKey | String  | Required      | Ali cloud access key.                                                                                                        |
| region          | String  | Required      | Serverless region,for example: cn-chengdu.                                                                                   |
| timeout         | Number  | 30000         | Request timeout time in milliseconds.                                                                                        |
| qualifier       | String  | LATEST        | Serverless version alias.                                                                                                    |
| internal        | Boolean | true          | Whether to use intranet requests.                                                                                            |
| secure          | Boolean | false         | Whether to enable request protection, <br>if enabled https requests will be used, otherwise http requests will be used.</br> |
| version         | String  | 2016-08-15    | Serverless api version.                                                                                                      |

## Usage

```typescript
import * as serverless from '@leaf-x/ali-cloud-serverless'

const { invoke, warmUp } = serverless({
  accountId: '89785723912113',
  accessId: 'ODk3ODU3MjM5MTIxMTM=',
  accessSecretKey: 'MTU4MzczNDMyNzMzMg==',
  region: 'cn-chengdu'
})

// Invoke the serverless function of the Ali cloud gateway trigger.
const invokeResult = invoke({
    serviceName:"snowflake",
    functionName:"IndexSnowflake"
    type: 'GATEWAY',
    data: { queryParameters: { name: 'snowflake' } }
})
  .then((response) => response)
  .catch((error) => error)

// Warm-up serverless functions to avoid cold starts.
 const warmUpResult = warmUp('snowflake', [
    { type: 'GATEWAY', functionName: 'snowflake' }
  ])

console.info(invokeResult)
console.info(warmUpResult)
```
