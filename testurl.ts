import http from 'http';
import { TFunc } from 'src/types';

const options = {method: 'HEAD', host: 'localhost', port: 80, path: '/tutorial'};

const func: TFunc = () => new Promise (resolve => {
  const req = http.request(options, (r) => {
    console.log('r = ', r);
    resolve({success: 'true'});
    // reject({
    //   error: Error('whatever')
    // }
  });
  req.end();
});

func();
