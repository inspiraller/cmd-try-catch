import got from 'got';

type TUrlExist = (url: string) => Promise<boolean>;

const urlExist: TUrlExist = url => 
  new Promise(async (resolve, reject) => {
    await got(url).then(() => {
      resolve(true);
    }).catch(() => {
      reject(false);
    })
});

export default urlExist;

// import http from 'http';

// const urlExist = async (url: string) => new Promise((resolve, reject) => {
//   const options = {method: 'HEAD', host: 'stackoverflow.com', port: 80, path: '/'};
//   const req = http.request(options, r => {
//     r.headers;
//   });
//   req.end();
// });
