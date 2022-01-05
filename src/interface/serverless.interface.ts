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
 * Options for serverless API.
 *
 * @extends AliCloudOptions
 */
export interface ServerlessOptions extends AliCloudOptions {
  /**
   * Serverless region.
   */
  region: string;

  /**
   * Set the request timeout in milliseconds. The default timeout is 3000
   * milliseconds.
   */
  timeout?: number;

  /**
   *  Serverless qualifier. default is LATEST.
   */
  qualifier?: string;

  /**
   * Whether to invoke through the intranet. default is true.
   */
  internal?: boolean;

  /**
   * Whether to open the secure invoke, if open will use HTTPS invoke,otherwise
   * use HTTP invoke. default is true.
   */
  secure?: boolean;

  /**
   * Serverless API version. default is 2016-08-15.
   */
  version?: string;
}

/**
 * The result of the serverless API.
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
