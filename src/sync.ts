import { exec } from 'child_process';
import { handleExecOut } from './promiseExec';
import { handleFunc } from './promiseFunc';

import {
  IObjCMD,
  IObjCMDFunc, 
  IObjCMDExec,
  TProcess,
  TGetMsg,
  TSync,
  TSyncTry,
  TSyncCatch
} from './types';

import chalk from 'chalk';
import print from './print';


// #########################################################################################
// code

// const defaultExecOptions: ExecOptions = {
// shell: 'customProcess.env.ComSpec', // from options in exec, or /bin/sh in unix

// Troubleshoot: - Error: spawn .env.ComSpec ENOENT
// https://stackoverflow.com/questions/38458118/nodejs-error-spawn-c-windows-system32-cmd-exe-enoent
// cwd: path.resolve(__dirname, '../') //'./',

// https://maxschmitt.me/posts/error-spawn-node-enoent-node-js-child-process/
// env: {
//   NODE_ENV: process.env.NODE_ENV,
//   PATH: process.env.PATH
// }

// };
// const defaultSpawnOptions: SpawnOptions = {
//   stdio: 'ignore', // 'inherit',
//   shell: true,
//   cwd: './',
//   detached: true
// };

/* istanbul ignore next */
const printTryCatch = (isTry: boolean, arr: IObjCMD[], len: number, msg: string) => {
  const intPos = getPosOfLen(arr, len);
  const separator = isTry ? '                                                  ' : '';
  const color = 'cyan';
  print(chalk[color](separator));
  if (isTry) {
    print(chalk[color](`${intPos}: ${msg}`));
  } else {
    print(chalk[color](`CATCH: ${msg}`));
  }
};

export const getPosOfLen = (arr: IObjCMD[], len: number): string =>
  arr.length ? `${len - (arr.length - 1)}` : String(len);

export const shallowCloneArrObjCMD = (arrNext: IObjCMD[]) =>
  arrNext.reduce((accum, current) => {
    let objCMD: IObjCMD = current;
    if (current.catch) {
      const { catch: aliasCatch, ...rest } = current;
      /* istanbul ignore next */
      const arrCatch: IObjCMD[] = aliasCatch ? shallowCloneArrObjCMD(aliasCatch) : [];
      objCMD = { ...rest, catch: arrCatch };
    }
    accum.push({ ...objCMD });
    return accum;
  }, [] as IObjCMD[]);

const getMsg: TGetMsg = objCMD => {
  const { msg, cmd, func } = objCMD;
  const strMsg: string = msg || cmd || (func && !(func instanceof Promise) && func.name) || '';
  return strMsg;
};

export const customProcess: TProcess = (objCMD, opt = {}) =>
  new Promise((resolve, reject) => {
    // const func: TFunc | undefined = objCMD && objCMD.func;
    if (objCMD.func) {
      handleFunc(objCMD as IObjCMDFunc, resolve, reject);
    } else {
      exec(objCMD.cmd as string, opt, handleExecOut(objCMD as IObjCMDExec, resolve, reject));
    }
  });

let sync: TSync;
let syncTry: TSyncTry;
let catchProcess: TSyncCatch;
let syncCatch: TSyncCatch;

catchProcess = async ({ arrNext, intNextLen, arrCatch, intCatchLen, intCatchCursor }) => {
  const isCatch = intCatchCursor < arrCatch.length;
  if (isCatch) {
    const handleCatch = await syncCatch({
      arrNext,
      intNextLen,
      arrCatch,
      intCatchLen,
      intCatchCursor
    });
    return handleCatch;
  }
  /* istanbul ignore next */
  print(chalk.bgRed(' ! Cannot continue ! no more catches'));
  return false;
};

syncCatch = async ({ arrNext, intNextLen, arrCatch, intCatchLen, intCatchCursor }) => {
  const strMsg = getMsg(arrCatch[intCatchCursor]);

  /* istanbul ignore next */
  printTryCatch(false, arrCatch, intCatchLen || 0, strMsg);

  const objCMD = arrCatch[intCatchCursor];
  intCatchCursor += 1;
  // const isCatchNext = intCatchCursor < arrCatch.length;

  const catchAll = await customProcess(objCMD)
    .then(() => {
      return true;
    })
    .catch(async () => {
      const catchEach = await catchProcess({
        arrNext,
        intNextLen,
        arrCatch,
        intCatchLen,
        intCatchCursor
      });
      return catchEach;
    });
  return catchAll;
};

syncTry = async ({ arrNext, intNextLen, intNextCursor }) => {
  const strMsg = getMsg(arrNext[intNextCursor]);
  /* istanbul ignore next */
  printTryCatch(true, arrNext, intNextLen, strMsg);

  const objCMD = arrNext[intNextCursor];
  intNextCursor += 1;
  const isNext = intNextCursor < arrNext.length;

  if (!objCMD || !(objCMD.cmd || objCMD.func)) {
    /* istanbul ignore next */
    print('Array has no objCMD', 'red');
    return false;
  }
  const arrCatch = objCMD.catch;
  const intCatchLen = (arrCatch && arrCatch.length) || 0;
  const intCatchCursor = 0;

  const tryAll = await customProcess(objCMD)
    .then(async () => {
      if (isNext) {
        const next = await syncTry({ arrNext, intNextLen, intNextCursor });
        return next;
      }
      return true;
    })
    .catch(async () => {
      if (!arrCatch || !arrCatch.length) {
        return false;
      }
      const catchAll = await catchProcess({
        arrNext,
        intNextLen,
        arrCatch,
        intCatchLen,
        intCatchCursor
      });

      if (catchAll) {
        if (isNext) {
          const next = await syncTry({ arrNext, intNextLen, intNextCursor });
          return next;
        }
        return true;
      }
      return false;
    });
  return tryAll;
  // return new Promise((resolve, reject) => resolve(true));
};

sync = async arrNext => {
  const cloneArrNext = shallowCloneArrObjCMD(arrNext);
  const intNextCursor = 0;
  const intNextLen = cloneArrNext.length;
  const isComplete = await syncTry({ arrNext: cloneArrNext, intNextLen, intNextCursor });
  return {
    map: cloneArrNext,
    isComplete
  };
};

export { syncTry, syncCatch, catchProcess };

export default sync;
