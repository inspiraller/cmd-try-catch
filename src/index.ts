import { exec, ExecOptions, ExecException } from 'child_process';
import chalk, { Color } from 'chalk';

export type TError = ExecException | null;
export type TSTDOut = string | Buffer;

export type TProcessResponseFunc = (error: TError, stdout: TSTDOut, stderr: TSTDOut) => void;

export type TProcessPromiseHandler = (
  resolve: (value: TSTDOut) => void,
  reject: (value: TError) => void
) => TProcessResponseFunc;

export interface IObjCMD {
  msg?: string;
  cmd?: string;
  func?: (fn: TProcessResponseFunc) => void;
  catch?: IObjCMD[];
}

type TSync = (
  arrNext: IObjCMD[],
  intNextLen?: number,
  arrCatch?: IObjCMD[],
  intCatchLen?: number
) => Promise<boolean>;

type TProcess = (objCMD?: IObjCMD, isSpawn?: boolean) => Promise<TSTDOut>;

const defaultExecOptions: ExecOptions = {
  shell: 'process.env.ComSpec', // from options in exec, or /bin/sh in unix
  cwd: './'
};
// const defaultSpawnOptions: SpawnOptions = {
//   stdio: 'ignore', // 'inherit',
//   shell: true,
//   cwd: './',
//   detached: true
// };

/* istanbul ignore next */
const print = (msg: string, color?: typeof Color) => {
  console.log(color ? chalk[color](msg) : msg);
};

/* istanbul ignore next */
const printTryCatch = (isTry: boolean, arr: IObjCMD[], len: number, msg: string) => {
  const intPos = getPosOfLen(arr, len);
  // const prefix: TPrefix = isTry ? 'Try: ' : 'Catch: ';
  const separator = isTry ? '                                                  ' : '';
  const color = isTry ? 'cyan' : 'cyan';

  print(chalk[color](separator));
  if (isTry) {
    print(chalk[color](`${intPos}: ${msg}`));
  } else {
    // print(chalk[color](`${prefix} (${intPos} of ${len}): ${msg}`));
    print(chalk[color](`CATCH: ${msg}`));
  }
};

export const processPromiseHandler: TProcessPromiseHandler = (resolve, reject) => (
  error,
  stdout,
  stderr
) => {
  // print(chalk.grey(` - ${msg}`));
  if (error) {
    print(chalk.grey(error));
    reject(error);
  } else {
    print(chalk.grey(stdout));
    resolve(stdout || stderr);
  }
};

export const process: TProcess = (objCMD, isSpawn = false) => {
  if (!objCMD) {
    print('no objCMD supplied to process');
    return new Promise(resolve => resolve(''));
  }
  const { cmd } = objCMD;
  return new Promise((resolve, reject) => {
    if (objCMD.func) {
      objCMD.func(processPromiseHandler(resolve, reject));
    }
    // if (isSpawn) {
    // need to figure out why typescript is not working for defaultExecOptions or defaultSpawnOptions
    //   spawn(cmd as string, defaultExecOptions, processPromiseHandler(resolve, reject));
    // }
    exec(cmd as string, defaultExecOptions, processPromiseHandler(resolve, reject));
  });
};

let syncCatch: TSync;
let sync: TSync;
let catchProcess: TSync;

export const getPosOfLen = (arr: IObjCMD[], len: number): string =>
  arr.length ? `${len - (arr.length - 1)}` : String(len);

catchProcess = async (arrNext, intNextLen, arrCatch, intCatchLen) => {
  if (arrCatch && arrCatch.length) {
    const handleCatch = await syncCatch(arrNext, intNextLen, arrCatch, intCatchLen);
    return handleCatch;
  }
  print(chalk.bgRed(' ! Cannot continue ! no more catches'));
  return false;
};
type TGetMsg = (objCMD: IObjCMD) => string;

const getMsg: TGetMsg = objCMD => {
  const { msg, cmd, func } = objCMD;
  const strMsg: string = msg || cmd || (func && func.name) || '';
  return strMsg;
};

sync = async (arrNext, intNextleng = 0) => {
  const intNextLen = intNextleng !== 0 ? intNextleng : arrNext.length;
  const strMsg = getMsg(arrNext[0]);

  printTryCatch(true, arrNext, intNextLen, strMsg);

  const objCMD = arrNext.shift();
  if (!objCMD) {
    console.warn('Array has no objCMD');
    return false;
  }
  const arrCatch = objCMD.catch;
  const intCatchLen = (arrCatch && arrCatch.length) || 0;
  const tryAll = await process(objCMD)
    .then(async () => {
      if (arrNext.length) {
        const next = await sync(arrNext, intNextLen);
        return next;
      }
      return true;
    })
    .catch(async () => {
      const catchAll = await catchProcess(arrNext, intNextLen, arrCatch, intCatchLen);
      if (catchAll) {
        if (arrNext && arrNext.length) {
          const next = await sync(arrNext, intNextLen);
          return next;
        }
        return true;
      }
      return false;
    });
  return tryAll;
};

syncCatch = async (arrNext, intNextLen, arrCatch, intCatchLen) => {
  if (!arrCatch) {
    print('arrCatch was not supplied to syncCatch');
    return false;
  }
  const strMsg = getMsg(arrCatch[0]);
  printTryCatch(false, arrCatch, intCatchLen || 0, strMsg);
  const objCMD = arrCatch.shift();
  const catchAll = await process(objCMD)
    .then(() => true)
    .catch(async () => {
      const catchEach = await catchProcess(arrNext, intNextLen, arrCatch, intCatchLen);
      return catchEach;
    });
  return catchAll;
};

export {
  sync,
  syncCatch,
  catchProcess
};

export default sync;
