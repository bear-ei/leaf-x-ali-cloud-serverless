import * as assert from 'assert';
import {
  handleCanonicalHeadersString,
  initHandleRequestHeaders,
} from '../src/headers';

describe('test/headers.test.ts', () => {
  it('should be a synchronization request header', async () => {
    const content = Buffer.from(JSON.stringify({data: 'This is request.'}));
    const result = initHandleRequestHeaders({
      host: 'leaf-x.com',
      accountId: '1787993',
      accessSecretKey: '5556123',
      accessId: '58575729',
    })({
      url: 'https://leaf-x.com',
      method: 'GET',
      content,
    });

    assert(typeof result === 'object');
    assert(result['accept'] === '*/*');
    assert(typeof result['date'] === 'string');
    assert(result['host'] === 'leaf-x.com');
    assert(result['user-agent'].startsWith('Node.js'));
    assert(result['x-fc-account-id'] === '1787993');
    assert(result['content-length'] === content.length.toString());
    assert(typeof result['content-md5'] === 'string');
    assert(result['content-type'] === 'application/json; charset=utf-8');
    assert(typeof result['authorization'] === 'string');
  });

  it('should be an asynchronous request header', async () => {
    const content = JSON.stringify({data: 'This is request.'});
    const result = initHandleRequestHeaders({
      host: 'leaf-x.com',
      accountId: '1787993',
      accessSecretKey: '5556123',
      accessId: '58575729',
    })({
      url: 'https://leaf-x.com',
      method: 'GET',
      content,
      async: true,
    });

    assert(typeof result === 'object');
    assert(result['accept'] === '*/*');
    assert(typeof result['date'] === 'string');
    assert(result['host'] === 'leaf-x.com');
    assert(result['user-agent'].startsWith('Node.js'));
    assert(result['x-fc-account-id'] === '1787993');
    assert(result['content-length'] === content.length.toString());
    assert(typeof result['content-md5'] === 'string');
    assert(result['x-fc-invocation-type'] === 'Async');
    assert(result['content-type'] === 'application/json; charset=utf-8');
    assert(typeof result['authorization'] === 'string');
  });

  it('should be the canonical request header string', async () => {
    const result = handleCanonicalHeadersString('x-fc-', {
      accept: 'application/json; charset=utf-8',
      date: new Date().toUTCString(),
      host: 'github.com',
      'user-agent': `Node.js/${process.version}`,
      'x-fc-account-id': '1787993',
      'content-type': 'application/octet-stream',
      'content-length': '255',
      'content-md5': 'bf32ca0ebf019d8ba4f95145a5a96865',
      'x-fc-invocation-type': 'Async',
    });

    assert(typeof result === 'string');
    assert(
      result ===
        ['x-fc-account-id:1787993', 'x-fc-invocation-type:Async'].join('\n')
    );
  });
});
