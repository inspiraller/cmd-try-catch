import { exec } from 'child_process';
import { IObjError, IObjSuccess, THandleExecOut, TPromiseExec } from './sync';

import print from './print';

export const handleExecOut: THandleExecOut = (objCMD, resolve, reject) => (
  error,
  stdout,
  stderr
) => {
  if (error) {
    const objError: IObjError = { error };
    objCMD.complete = objError;
    print(String(error), 'red');
    reject({ error });
  } else {
    const objSuccess: IObjSuccess = { success: stdout || stderr };
    print(String(stdout), 'green');
    objCMD.complete = objSuccess;
    resolve(objSuccess);
  }
};

const promiseExec: TPromiseExec = (objCMD, opt = {}) =>
  new Promise((resolve, reject) => {
    exec(objCMD.cmd, opt, handleExecOut(objCMD, resolve, reject));
  });

export default promiseExec;
