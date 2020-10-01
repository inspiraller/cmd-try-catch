import { exec } from 'child_process';
import { handleExecOut } from './promiseExec';
import { handleFunc } from './promiseFunc';
import * as types from './types';

import {
  IObjCMD,
  IObjCMDCatch,
  IObjCMDFunc, 
  IObjCMDExec,
  TProcess,
  TGetMsg,
  TSync,
  TSyncTry,
  TSyncCatch, IObjError
} from './types';

import chalk from 'chalk';
import print from './print';

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

catchProcess = async ({ arrNext, intNextLen, arrCatch, intCatchLen, errErrorOrObj }) => {
  const isCatch = arrCatch.length;
  if (isCatch) {
    const handleCatch = await syncCatch({
      arrNext,
      intNextLen,
      arrCatch,
      intCatchLen,
      errErrorOrObj
    });
    return handleCatch;
  }
  /* istanbul ignore next */
  print(chalk.bgRed(' ! Cannot continue ! no more catches'));
  return false;
};

type TGetTroubleshootCursor = (arrCatch: IObjCMDCatch[], strError: string) => number;
const getTroubleshootCursor: TGetTroubleshootCursor = (arrCatch, strError: string) => 
  arrCatch.findIndex(objCMD => {
      const troubleshoot = objCMD.troubleshoot || null;
      return troubleshoot && strError.search(troubleshoot) !== -1;
    });

type TGetCatchAny =  (arrCatch: IObjCMDCatch[]) => number;
const getCatchAny: TGetCatchAny = arrCatch => 
  arrCatch.findIndex((objCMD: IObjCMDCatch) => 
    objCMD.complete === undefined
  );

type TGetCatchCursor = (arrCatch: IObjCMDCatch[], errErrorOrObj: IObjError) => number;   
const getCatchCursor: TGetCatchCursor = (arrCatch, errErrorOrObj) => {
  const strError: string = String(errErrorOrObj.error);
  const intTroubleshootInd: number = getTroubleshootCursor(arrCatch, strError);
  return (intTroubleshootInd === -1) ? getCatchAny(arrCatch) : intTroubleshootInd;
}

syncCatch = async ({ arrNext, intNextLen, arrCatch, intCatchLen, errErrorOrObj }) => {

  const intCatchCursor: number = getCatchCursor(arrCatch, errErrorOrObj); 
  if (intCatchCursor === -1) {
    return false; // auto catch in catchProcess above - ! Cannot continue ! no more catches
  }
  const strMsg = getMsg(arrCatch[intCatchCursor]);

  /* istanbul ignore next */
  printTryCatch(false, arrCatch, intCatchLen || 0, strMsg);


  const objCMD = arrCatch.slice(intCatchCursor, intCatchCursor + 1)[0];

  const catchAll = await customProcess(objCMD)
    .then(() => {
      return true;
    })
    .catch(async err2 => {
      const catchEach = await catchProcess({
        arrNext,
        intNextLen,
        arrCatch,
        intCatchLen,
        errErrorOrObj: err2
      });
      return catchEach;
    });
  return catchAll;
};

type TGetNext = (arrNext: IObjCMD[], intNextCursor: number) => boolean;
const getNext: TGetNext = (arrNext, intNextCursor) => intNextCursor < arrNext.length;

// type TGetCatchCursor = (arrCatch: IObjCMDCatch[]) => number;
// const getCatchCursor: TGetCatchCursor = arrCatch => (
//   arrCatch && arrCatch.length && arrCatch.findIndex((objCMD: IObjCMDCatch) => objCMD.complete === undefined)
// );

syncTry = async ({ arrNext, intNextLen, intNextCursor }) => {
  const strMsg = getMsg(arrNext[intNextCursor]);
  /* istanbul ignore next */
  printTryCatch(true, arrNext, intNextLen, strMsg);

  const objCMD = arrNext[intNextCursor];
  if (!objCMD || !(objCMD.cmd || objCMD.func)) {
    /* istanbul ignore next */
    print('Array has no objCMD', 'red');
    return false;
  }
  const arrCatch = objCMD.catch;
  const intCatchLen = (arrCatch && arrCatch.length) || 0;

  const tryAll = await customProcess(objCMD)
    .then(async () => {
      if (getNext(arrNext, intNextCursor + 1)) {
        const next = await syncTry({ arrNext, intNextLen, intNextCursor: intNextCursor + 1});
        return next;
      }
      return true;
    })
    .catch(async errErrorOrObj => {
      if (!arrCatch || !arrCatch.length) {
        return false;
      }
      const catchAll = await catchProcess({
        arrNext,
        intNextLen,
        arrCatch,
        intCatchLen,
        errErrorOrObj
      });

      if (catchAll) {
        const next = await syncTry({ arrNext, intNextLen, intNextCursor });
        return next;
      }
      return false;
    });
  return tryAll;
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

export { syncTry, syncCatch, catchProcess, types };

export * from './types';

export default sync;
