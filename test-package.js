import util from 'util';
import sync from 'src/sync';
import urlExistPromise from '__tests__/utils/urlExistPromise';

const init = async () => {
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
