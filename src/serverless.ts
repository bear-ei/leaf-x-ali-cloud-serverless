import {initInvoke} from './invoke';
import {initWarmUp} from './warm_up';

/**
 * Ali cloud options.
 */
export interface AliCloudOptions {
  /**
   * Ali cloud account ID.
   */
  accountId: string;

  /**
   * Ali cloud access ID.
   */
  accessId: string;

  /**
   * Ali cloud access key.
   */
  accessSecretKey: string;
}

/**
 * Serverless options.
 */
export interface ServerlessOptions extends AliCloudOptions {
  /**
   * Serverless region.
   */
  region: string;

  /**
   * Serverless request timeout, the default is 3000 milliseconds.
   */
  timeout?: number;

  /**
   * Serverless request version alias, default is 'LATEST'.
   */
  qualifier?: string;

  /**
   * Whether to enable intranet access, default is true.
   */
  internal?: boolean;

  /**
   * Whether to enable request protection, default is true.
   */
  secure?: boolean;

  /**
   * Serverless API version number, default is '2016-08-15'.
   */
  version?: string;
}

/**
 * Serverless.
 *
 * @param options Serverless options.
 */
export const serverless = ({
  accountId,
  region,
  timeout = 30000,
  version = '2016-08-15',
  qualifier = 'LATEST',
  internal = true,
  secure = true,
  ...args
}: ServerlessOptions) => {
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

  return Object.freeze({
    invoke: initInvoke(options),
    warmUp: initWarmUp(options),
  });
};
