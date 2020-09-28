
import { exec } from 'child_process';
import { THandleExecOut, TPromiseExec } from './types';

import print from './print';

export const handleExecOut: THandleExecOut = (resolve, reject) => (
  error,
  stdout,
  stderr
) => {
  if (error) {
    print(String(error), 'red');
    reject({ error });
  } else {
    resolve({ success: stdout || stderr });
  }
};

const promiseExec: TPromiseExec = (cmd, opt = {}) => new Promise((resolve, reject) => {
  exec(cmd, opt, handleExecOut(resolve, reject));
});

export default promiseExec;
