import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import sync, { ISyncReturn, TFunc } from 'src/sync';
import { urlExistPromiseAsObject } from './utils/urlExistPromise';

let objReturn: ISyncReturn;

const getUrlDockerTutorial: TFunc = async () =>
  await urlExistPromiseAsObject('http://localhost/tutorial');

// const getUrlDockerTutorial: TFunc | (() => void) = async () =>
//   await urlExistPromise('http://localhost/tutorial')
//     .then(res => ({success: String(res) }))
//     .catch(err => ({error: err}));

const id = uuidv4();

describe('sync - usecase', () => {
  describe('Test if docker tutorial is running in localhost. Otherwise catch and run docker getting started, then retest', () => {
    beforeAll(async () => {
      objReturn = await sync([
        {
          func: getUrlDockerTutorial,
          catch: [
            // {
            //   cmd: 'some error'
            // },
            // {
            //   cmd: 'some error'
            // },
            {
              troubleshoot: /localhost\/tutorial\"\sdoes\snot\sexist/,
              cmd: `docker run -d -p 80:80 --name ${id} docker/getting-started`
            }
          ]
        }
      ]);
    });
    afterAll(() => {
      // note: async, await = work not finished and memory leak
      exec(`docker stop ${id}`);
      exec(`docker rm ${id}`);
    });
    it('should complete', () => {
      expect(objReturn.isComplete).toBe(true);
    });
  });
});
