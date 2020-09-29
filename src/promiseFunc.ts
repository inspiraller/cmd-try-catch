import { IObjSuccess, IObjError, THandleFunc } from './types';
import {
  IExecOutput,
  IObjSuccessOrError,
  TPromiseResponse,
  THandleFuncResult,
  THandleFuncAsPromise
} from './types';

export const handleFuncAsResult: THandleFuncResult = (objCMD, result, resolve, reject) => {
  try {
    if (result.success) {
      const objSuccess: IObjSuccess = result as IObjSuccess;
      objCMD.complete = objSuccess;
      resolve(objSuccess);

    } else if (result.error) {
      const objError: IObjError = result as IObjError;
      objCMD.complete = objError;
      reject(objError);

    } else {
      const objError: IObjError = {
        error: Error('You have not supplied a success or error response in your function.')
      };
      objCMD.complete = objError;
      reject(objError);
  
    }
  } catch (err) {
    /* istanbul ignore next */
    const objError: IObjError = {
      error: err
    };
    /* istanbul ignore next */
    objCMD.complete = objError;
    /* istanbul ignore next */
    reject(objError);
  }
};

export const handleFuncAsPromise: THandleFuncAsPromise = (objCMD, response, resolve, reject) => {
  response
    .then(result => {
      objCMD.complete = result;
      resolve(result);
    })
    .catch((err: IExecOutput['error']) => {
      const objError: IObjError = { error: err };
      objCMD.complete = objError
      reject(objError);
    });
};

export const handleFunc: THandleFunc = (objCMD, resolve, reject) => {
  const response: IObjSuccessOrError | TPromiseResponse = objCMD.func();
  if (response instanceof Promise) {
    handleFuncAsPromise(objCMD, response, resolve, reject);
  } else {
    const result: IObjSuccessOrError = response;
    handleFuncAsResult(objCMD, result, resolve, reject);
  }
};
