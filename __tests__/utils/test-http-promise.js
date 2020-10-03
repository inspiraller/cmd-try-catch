const http = require('http');
const options = { method: 'HEAD', host: 'localhost', port: 80, path: '/tutorial' };

console.log('options = ', options);
const statusOk = status => String(status).search(/^[23]/) !== -1;

const urlExist = () =>
  new Promise((resolve, reject) => {
    const req = http.request(options, resp => {
      if (statusOk(resp.statusCode)) {
        resolve(true);
      }
      reject(resp.statusCode);
    });
    req.on('error', err => {
      reject(err);
    });
    req.end();
  });

const promiseGet = async () =>
  await urlExist()
    .then(success => {
      console.log('result = ', success);
    })
    .catch(err => {
      console.log('catch err = ', err);
    });

const init = async () => {
  await promiseGet();
}

init();
