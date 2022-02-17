import {throwError} from '.';
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

  /**
   * Ali cloud serverless security token.
   */
  securityToken?: string;
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
  isInternal?: boolean;

  /**
   * Whether to turn on request protection.
   *
   * The default value is true.
   */
  isSecure?: boolean;

  /**
   * Serverless API version number.
   *
   * The default value is 2016-08-15.
   */
  version?: string;
}

/**
 * Ali cloud serverless API.
 *
 * @param options Serverless options.
 */
export const serverless = ({
  accountId,
  region,
  timeout = 30000,
  version = '2016-08-15',
  qualifier = 'LATEST',
  isInternal = true,
  isSecure = true,
  ...args
}: ServerlessOptions) => {
  const protocol = isSecure ? 'https' : 'http';
  const network = isInternal ? '-internal' : '';
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

  const isSTS = options.accessId.startsWith('STS');

  isSTS && throwError({isSTS}, 'The securityToken must be passed in the STS.');

  return Object.freeze({
    invoke: initInvoke(options),
    warmUp: initWarmUp(options),
  });
};
