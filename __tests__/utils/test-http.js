const http = require('http');
const options = { method: 'HEAD', host: 'localhost', port: 80, path: '/tutorial' };

const init = () => {
  const req = http.request(options, res => {
    console.log('http - res.status = ', res.statusCode); //4** | 5**
  });
  req.on('error', err => {
    console.log("http on('error') = ", err);
  });
  req.end();
};

init();
