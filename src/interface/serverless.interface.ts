import {Invoke} from './invoke.interface';
import {WarmUp} from './warm_up.interface';

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
   * Ali cloud serverless access key.
   */
  accessSecretKey: string;
}

/**
 * Serverless options.
 *
 * @extends AliCloudOptions
 */
export interface ServerlessOptions extends AliCloudOptions {
  /**
   * Serverless region.
   */
  region: string;

  /**
   * Timeout time, in milliseconds.
   *
   * Default:30000ms
   */
  timeout?: number;

  /**
   * Serverless qualifier.
   *
   * Default:LATEST
   */
  qualifier?: string;

  /**
   * Whether to invoke through the intranet.
   *
   * Default:true
   */
  internal?: boolean;

  /**
   * Whether to open the secure invoke, if open will use HTTPS invoke,otherwise
   * use HTTP invoke.
   *
   * Default:true
   */
  secure?: boolean;

  /**
   * Serverless API version.
   *
   * Default:2016-08-15
   */
  version?: string;
}

/**
 * Serverless result.
 */
export interface ServerlessResult {
  /**
   *  Invoke serverless.
   */
  readonly invoke: Invoke;

  /**
   * Warm-up serverless.
   */
  readonly warmUp: WarmUp;
}

/**
 * Serverless API.
 *
 * @param options ServerlessOptions
 * @return ServerlessResult
 */
export interface Serverless {
  (options: ServerlessOptions): ServerlessResult;
}
