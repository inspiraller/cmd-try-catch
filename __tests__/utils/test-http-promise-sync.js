const http = require('http');
const options = { method: 'HEAD', host: 'localhost', port: 80, path: '/tutorial' };

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

const init = async () => {
  let result;
  try {
    result = await urlExist();
  } catch (err) {
    console.log('catch err = ', err);
  }
  console.log('result = ', result);
};

init();
