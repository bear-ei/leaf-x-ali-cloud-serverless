import * as assert from 'assert';
import * as nock from 'nock';
import * as request from '../src/request';

describe('test/request.test.ts', () => {
  before(async () => {
    const response = {
      status: 200,
      data: '',
      headers: {},
      statusText: '',
      url: '',
    };

    nock('https://leaf-x.app').get('/default/succeed').reply(200, response);
    nock('https://leaf-x.app').post('/custom/succeed').reply(200, response);
  });

  it('should be the default request', async () => {
    await request
      .initRequest({
        host: '',
        accountId: '213',
        accessSecretKey: '5556123',
        accessId: '58575729',
      })('https://leaf-x.app/default/succeed')
      .then(result => assert(result.status === 200));
  });

  it('should be the correct request', async () => {
    await request
      .initRequest({
        host: '',
        accountId: '213',
        accessSecretKey: '5556123',
        accessId: '58575729',
      })('https://leaf-x.app/custom/succeed', {method: 'POST', body: '1'})
      .then(result => assert(result.status === 200));
  });
});
