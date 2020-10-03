import urlExist, { TUrlResponse } from './urlExist';

import { TPromiseResponse } from 'src/sync';

type TConstructError = (url: string) => string;
const constructError: TConstructError = url => `url: "${url}" does not exist`;

type TUrlExistPromiseAsObject = (url: string) => TPromiseResponse;
const urlExistPromiseAsObject: TUrlExistPromiseAsObject = async url =>
  await new Promise(async (resolve, reject) => {
    // debug - hanging in jest
    // console.log('1) before request of urlExist()');
    try {
      // const exist: TUrlResponse = await urlExist(url);
      await urlExist(url);
      // debug hanging in jest
      // console.log('EXPECT: got exist = ', exist);
      // await urlExist(url);
      resolve({
        success: 'true'
      });
    } catch (err) {
      reject({
        error: Error(constructError(url))
      });
    }
  });

type TUrlExistPromise = (url: string) => Promise<boolean>;
const urlExistPromise: TUrlExistPromise = async url =>
  await new Promise(async (resolve, reject) => {
    const exist: TUrlResponse = await urlExist(url);
    if (exist) {
      resolve(true);
    } else {
      reject(Error(constructError(url)));
    }
  });

export { urlExistPromiseAsObject };

export default urlExistPromise;

//
// import urlExist, { TUrlResponse } from './urlExist';
//
// import { TPromiseResponse } from 'src/sync';
//
// type TConstructError = (url: string) =>  string;
// const constructError: TConstructError = url => `url: "${url}" does not exist`;
//
// type TUrlExistPromiseAsObject = (url: string) => TPromiseResponse;
// const urlExistPromiseAsObject: TUrlExistPromiseAsObject = url =>
//   new Promise (async (resolve, reject) => {
//     await urlExist(url).then(res => {
//       resolve({
//         success:  String(res)
//       });
//     }).catch(() => {
//       reject({
//         error: Error(constructError(url))
//       })
//     });
//   });
//
// type TUrlExistPromise = (url: string) => Promise<TUrlResponse>;
// const urlExistPromise: TUrlExistPromise = url => new Promise (async (resolve, reject) => {
//     await urlExist(url).then(res => {
//       resolve(res);
//     }).catch(() => {
//       reject(Error(constructError(url)));
//     })
//   });
//
// export {
//   urlExistPromiseAsObject
// };
//
// export default urlExistPromise;

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
