// import got from 'got';

// export type TUrlResponse = number | boolean | string;

// type TUrlExist = (url: string) => Promise<TUrlResponse>;
// const urlExist: TUrlExist = url =>
//   new Promise(async (resolve, reject) => {
//     const x = await got(url)
//       .then(() => {
//         console.log('got() resolve');
//         resolve(true);
//       })
//       .catch(() => {
//         console.log('got() reject');
//         reject(false);
//       });
//     console.log('got x = ', x);
//   });

// export default urlExist;
// ################################################################

import http from 'http';

type TStatusOk = (status: number | undefined) => boolean;
const statusOk: TStatusOk = status => String(status).search(/^[23]/) !== -1;

type TExtractUrl = (
  str: string
) => null | {
  host: string;
  port: number;
  path: string;
};
const extractUrl: TExtractUrl = str => {
  const result: string[] | null = str.match(/^(https?\:\/\/)?([^\/\:]+)(\:\d+)?(\/[\w\W]+)?/);
  return (
    result && {
      host: result[2] || '',
      port: parseInt(result[3], 10) || 80,
      path: result[4] || ''
    }
  );
};

export type TUrlResponse = number | boolean | string;
type TUrlExist = (url: string) => Promise<TUrlResponse>;
const urlExist: TUrlExist = url =>
  new Promise((resolve, reject) => {
    const objUrl = extractUrl(url);
    if (!objUrl) {
      reject(`bad url = ${url}`);
    }
    const options = { method: 'HEAD', ...objUrl };
    const req = http.request(options, resp => {
      if (statusOk(resp.statusCode)) {
        resolve(resp.statusCode);
      }
      reject(resp.statusCode);
    });
    req.on('error', err => {
      reject(err);
    });
    req.end();
  });

export default urlExist;
