import * as assert from 'assert';
import * as nock from 'nock';
import * as request from '../src/request';

const result = {
  status: 200,
  data: '',
  headers: {},
  statusText: '',
  url: '',
};

describe('test/request.test.ts', () => {
  before(async () => {
    nock('https://leaf-x.app').get('/default/succeed').reply(200, result);
    nock('https://leaf-x.app').post('/custom/succeed').reply(200, result);
  });

  it('should be the result of a default option request', async () => {
    await request
      .initRequest({
        host: '',
        accountId: '213',
        accessSecretKey: '5556123',
        accessId: '58575729',
      })('https://leaf-x.app/default/succeed')
      .then(result => assert(result.status === 200));
  });

  it('should be the result of a custom option request', async () => {
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
