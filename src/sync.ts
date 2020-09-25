import { exec, ExecOptions } from 'child_process';
import { handleExecOut } from './promiseExec';
import { handleFunc } from './promiseFunc';

import chalk from 'chalk';
import print from './print';

export interface IObjCMD {
  msg?: string;
  cmd?: string;
  func?: TFunc;
  catch?: IObjCMD[];
}
// IObjCMD
interface ISync {
  arrNext: IObjCMD[];
}

interface ISyncTry extends ISync {
  intNextLen: number;
  arrCatch?: IObjCMD[];
  intCatchLen?: number;
}

interface ISyncCatch extends ISync {
  intNextLen: number;
  arrCatch: IObjCMD[];
  intCatchLen: number;
}

type TSync = (arrNext: ISync['arrNext']) => Promise<boolean>;
type TSyncTry = (props: ISyncTry) => Promise<boolean>;
type TSyncCatch = (props: ISyncCatch) => Promise<boolean>;

type TProcess = (
  objCMD?: IObjCMD,
  opt?: ExecOptions
) => TPromiseResponse;

type TGetMsg = (objCMD: IObjCMD) => string;

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

// shallowCloneArrObjCMD () - notes:
//   Will only clone single level - [{key: value, catch: [{key: value}]}]
//   Won't clone deeper level - [{key: {deepkey: value}, catch: [{key: {deepkey: value}}]}]

const shallowCloneArrObjCMD = (arrNext: IObjCMD[]) =>
  arrNext.reduce((accum, current) => {
    let objCMD: IObjCMD = current;
    if (current.catch) {
      const { catch: aliasCatch, ...rest } = current;
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
    if (!objCMD || (!objCMD.cmd && !objCMD.func)) {
      reject({ error: Error('no objCMD cmd or func supplied to customProcess') });
    } else if (objCMD.func) {
      handleFunc(objCMD.func, resolve, reject);
    } else {
      exec(objCMD.cmd as string, opt, handleExecOut(resolve, reject));
    }
  });

let sync: TSync;
let syncTry: TSyncTry;
let catchProcess: TSyncTry;
let syncCatch: TSyncCatch;

catchProcess = async ({ arrNext, intNextLen, arrCatch, intCatchLen }) => {
  if (arrCatch && arrCatch.length) {
    const handleCatch = await syncCatch({
      arrNext,
      intNextLen,
      arrCatch,
      intCatchLen: intCatchLen as number
    });
    return handleCatch;
  }
  print(chalk.bgRed(' ! Cannot continue ! no more catches'));
  return false;
};

syncCatch = async ({ arrNext, intNextLen, arrCatch, intCatchLen }) => {
  const strMsg = getMsg(arrCatch[0]);
  printTryCatch(false, arrCatch, intCatchLen || 0, strMsg);
  const objCMD = arrCatch.shift();
  const catchAll = await customProcess(objCMD)
    .then(() => {
      return true;
    })
    .catch(async () => {
      const catchEach = await catchProcess({
        arrNext,
        intNextLen,
        arrCatch,
        intCatchLen
      });
      return catchEach;
    });
  return catchAll;
};

syncTry = async ({ arrNext, intNextLen }) => {
  const strMsg = getMsg(arrNext[0]);
  printTryCatch(true, arrNext, intNextLen, strMsg);

  const objCMD = arrNext.shift();
  if (!objCMD || !(objCMD.cmd || objCMD.func)) {
    /* istanbul ignore next */
    print('Array has no objCMD', 'red');
    return false;
  }
  const arrCatch = objCMD.catch;
  const intCatchLen = (arrCatch && arrCatch.length) || 0;

  const tryAll = await customProcess(objCMD)
    .then(async () => {
      if (arrNext.length) {
        const next = await syncTry({ arrNext, intNextLen });
        return next;
      }
      return true;
    })
    .catch(async () => {
      const catchAll = await catchProcess({
        arrNext,
        intNextLen,
        arrCatch,
        intCatchLen
      });
      if (catchAll) {
        if (arrNext && arrNext.length) {
          const next = await syncTry({ arrNext, intNextLen });
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
  const intNextLen = cloneArrNext.length;
  const isComplete = await syncTry({ arrNext: cloneArrNext, intNextLen });
  return isComplete;
};

export { syncTry, syncCatch, catchProcess };

export default sync;
