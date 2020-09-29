import { v4 as uuidv4 } from 'uuid';
import {exec} from 'child_process';

import { ISyncReturn , TFunc } from 'src/types';
import sync from 'src/sync';
import urlExistPromise from './utils/urlExistPromise';

let objReturn: ISyncReturn;

const getUrlDockerTutorial: TFunc = async () => await urlExistPromise('http://localhost/tutorial');

let id: string = uuidv4();
describe('sync - usecase', () => {
  describe('Test if docker tutorial is running in localhost. Otherwise catch and run docker getting started, then retest', () => {
    beforeAll(async () => {
      objReturn = await sync([
        {
          func: getUrlDockerTutorial,
          catch: [{
            cmd: `docker run -d -p 80:80 --name ${id} docker/getting-started`
          }]
        }, {
          func: getUrlDockerTutorial
        }
      ]);
    });
    afterAll(async () => {
      await exec(`docker stop ${id}`);
      await exec(`docker rm ${id}`);
    })
    it('should complete', () => {
      expect(objReturn.isComplete).toBe(true);
    });
  });
});
