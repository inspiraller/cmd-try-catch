import { ISyncReturn , TFunc } from 'src/types';
import sync from 'src/sync';
import urlExistPromise from './utils/urlExistPromise';

const getUrlDockerTutorial: TFunc = async () => await urlExistPromise('http://localhost/tutorial');

let objReturn: ISyncReturn;

describe('sync - urlExistPromise', () => {
  beforeAll(async () => {
    objReturn = await sync([
      {
        func: getUrlDockerTutorial
      }
    ]);
  });
  it('should complete', () => {
    expect(objReturn.isComplete).toBe(true);
  });
});
