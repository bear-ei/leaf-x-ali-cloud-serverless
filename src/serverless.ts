import {Serverless} from './interface/serverless.interface';
import {initInvoke} from './invoke';
import {initWarmUp} from './warm_up';

export const serverless: Serverless = ({
  accountId,
  region,
  timeout = 30000,
  version = '2016-08-15',
  qualifier = 'LATEST',
  internal = true,
  secure = true,
  ...args
}) => {
  const protocol = secure ? 'https' : 'http';
  const network = internal ? '-internal' : '';
  const endpoint = `${protocol}://${accountId}.${region}${network}.fc.aliyuncs.com`;
  const host = `${accountId}.${region}${network}.fc.aliyuncs.com`;
  const options = {
    accountId,
    host,
    timeout,
    qualifier,
    version,
    endpoint,
    ...args,
  };

  return {invoke: initInvoke(options), warmUp: initWarmUp(options)};
};
