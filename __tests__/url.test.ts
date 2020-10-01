import sync, { ISyncReturn , TFunc } from 'src/sync';
import { urlExistPromiseAsObject } from './utils/urlExistPromise';

const getGoogleUrl: TFunc = async () => await urlExistPromiseAsObject('http://www.google.com');

let objReturn: ISyncReturn;

describe('sync - urlExistPromise', () => {
  beforeAll(async () => {
    objReturn = await sync([
      {
        func: getGoogleUrl
      }
    ]);
  });
  it('should complete - if this fails then its because your internet is down!', () => {
    expect(objReturn.isComplete).toBe(true);
  });
});
