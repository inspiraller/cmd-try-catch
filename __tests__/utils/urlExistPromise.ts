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
        error: Error(`url: "${url}" does not exist`)
      })
    }
  });

export default urlExistPromise;

/* 
// usecase 
 
import urlExistPromise from '__tests__/utils/urlExistPromise';

const init = async () => {
  const exist: IObjSuccessOrError | void = await urlExistPromise('http://localhost/tutorial').catch(err => {
    console.log('err = ', err);
  });
  console.log('exist =', exist);
}

init();
 */