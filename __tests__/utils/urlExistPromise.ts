
import urlExist from './urlExist';

import { TPromiseResponse } from 'src/sync';

type TConstructError = (url: string) =>  string;
const constructError: TConstructError = url => `url: "${url}" does not exist`;

type TUrlExistPromiseAsObject = (url: string) => TPromiseResponse;
const urlExistPromiseAsObject: TUrlExistPromiseAsObject = async url =>
  await new Promise (async (resolve, reject) => {
    const exist: boolean = await urlExist(url);
    if (exist) {
      resolve({
        success:  'true'
      });
    } else {
      reject({
        error: Error(constructError(url))
      })
    }
  });

type TUrlExistPromise = (url: string) => Promise<boolean>;
const urlExistPromise: TUrlExistPromise = async url =>
  await new Promise (async (resolve, reject) => {
    const exist: boolean = await urlExist(url);
    if (exist) {
      resolve(true);
    } else {
      reject(Error(constructError(url)))
    }
  });

export {
  urlExistPromiseAsObject
};

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