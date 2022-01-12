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
   * Ali cloud serverless access ID.
   */
  accessId: string;

  /**
   * Ali cloud serverless access secret key.
   */
  accessSecretKey: string;
}

/**
 * Serverless options.
 */
export interface ServerlessOptions extends AliCloudOptions {
  /**
   * Serverless is located in the region.
   */
  region: string;

  /**
   * Request timeout time.
   *
   * The default value is 3000 milliseconds.
   */
  timeout?: number;

  /**
   * Request service qualifier.
   *
   * The default value is LATEST.
   */
  qualifier?: string;

  /**
   * Whether the request is made through the intranet.
   *
   * The default value is true.
   */
  internal?: boolean;

  /**
   * Whether to turn on request protection.
   *
   * The default value is true.
   */
  secure?: boolean;

  /**
   * Serverless API version number.
   *
   * The default value is 2016-08-15.
   */
  version?: string;
}

/**
 * Ali cloud serverless microservice applications.
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
