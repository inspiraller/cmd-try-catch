import util from 'util';
import sync from 'src/sync';

// const sync = require('cmd-try-catch').default;
const got = require('got');

let startTime;

const urlExistPromise = url =>
  new Promise(async (resolve, reject) => {
    const startTimeGot = new Date().getTime();
    await got(url)
      .then(() => {
        const endTimeThen = new Date().getTime();
        console.log('time of got.then= ', (endTimeThen - startTimeGot) / 1000);
        resolve({
          success: url
        });
      })
      .catch(() => {
        // 10 seconds to catch !!!
        const endTimeCatch = new Date().getTime();
        console.log('time of got.catch = ', (endTimeCatch - startTimeGot) / 1000);
        reject({
          error: Error(`url: "${url}" does not exist`)
        });
      });
  });

const init = async () => {
  startTime = new Date().getTime();
  const objReturn = await sync([
    {
      func: async () => await urlExistPromise('http://localhost/tutorial'),
      catch: [
        {
          troubleshoot: /url\:\s\"http\:\/\/localhost\/tutorial\"\sdoes\snot\sexist/,
          cmd: `docker run -d -p 80:80 --name mydocker docker/getting-started`
        }
      ]
    }
  ]);
  console.log('objReturn= ', util.inspect(objReturn, true, 4));
};

init();
