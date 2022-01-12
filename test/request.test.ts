import * as assert from 'assert';
import * as nock from 'nock';
import {initRequest} from '../src/request';

describe('test/request.test.ts', () => {
  before(async () => {
    const response = {
      status: 200,
      data: '',
      headers: {},
      statusText: '',
      url: '',
    };

    nock('https://leaf-x.com').get('/default/succeed').reply(200, response);
    nock('https://leaf-x.com').post('/custom/succeed').reply(200, response);
  });

  it('should be the default request', async () => {
    const request = initRequest({
      host: '',
      accountId: '213',
      accessSecretKey: '5556123',
      accessId: '58575729',
    });

    await request('https://leaf-x.com/default/succeed').then(result =>
      assert(result.status === 200)
    );
  });

  it('should be the correct request', async () => {
    const request = initRequest({
      host: '',
      accountId: '213',
      accessSecretKey: '5556123',
      accessId: '58575729',
    });

    await request('https://leaf-x.com/custom/succeed', {
      method: 'POST',
      body: '1',
    }).then(result => assert(result.status === 200));
  });
});
