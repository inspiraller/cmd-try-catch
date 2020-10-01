"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFunc = exports.handleFuncAsPromise = exports.getRejectWithoutObj = exports.getResolveWithoutObj = exports.handleFuncAsResult = void 0;
exports.handleFuncAsResult = (objCMD, result, resolve, reject) => {
    try {
        if (result.success) {
            const objSuccess = result;
            objCMD.complete = objSuccess;
            resolve(objSuccess);
        }
        else if (result.error) {
            const objError = result;
            objCMD.complete = objError;
            reject(objError);
        }
        else {
            const objError = {
                error: Error('You have not supplied a success or error response in your function.')
            };
            objCMD.complete = objError;
            reject(objError);
        }
    }
    catch (err) {
        const objError = {
            error: err
        };
        objCMD.complete = objError;
        reject(objError);
    }
};
exports.getResolveWithoutObj = (success) => typeof success === 'string' || Buffer.isBuffer(success) || !success ? success : success.success;
exports.getRejectWithoutObj = (err) => err instanceof Error || !err ? err : err.error;
exports.handleFuncAsPromise = (objCMD, response, resolve, reject) => {
    response
        .then(result => {
        const success = exports.getResolveWithoutObj(result);
        const objSuccess = {
            success
        };
        objCMD.complete = objSuccess;
        resolve(objSuccess);
    })
        .catch((err) => {
        const error = exports.getRejectWithoutObj(err);
        const objError = {
            error
        };
        objCMD.complete = objError;
        reject(objError);
    });
};
exports.handleFunc = (objCMD, resolve, reject) => {
    const response = objCMD.func();
    if (response instanceof Promise) {
        exports.handleFuncAsPromise(objCMD, response, resolve, reject);
    }
    else {
        const result = response;
        exports.handleFuncAsResult(objCMD, result, resolve, reject);
    }
};
//# sourceMappingURL=promiseFunc.js.map