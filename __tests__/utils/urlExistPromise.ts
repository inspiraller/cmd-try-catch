import urlExist from 'url-exist';
import { TPromiseResponse } from 'src/types';

type TUrlExistPromise = (url: string) => TPromiseResponse;

const urlExistPromise: TUrlExistPromise = async url =>
  await new Promise (async (resolve, reject) => {
    const exist: boolean = await urlExist(url);
    if (exist) {
      resolve({
        success:  url
      });
    } else {
      reject({
        error: Error(`does not exist -${url}`)
      })
    }
  });

export default urlExistPromise;

// const init = async () => {
//   const result = await urlExistPromise('http://localhost/tutorial');
//   console.log('result = ', result);
// }
// init();

// module.exports = urlExistPromise;

