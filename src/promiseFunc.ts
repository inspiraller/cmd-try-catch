export const handleFuncAsResult: THandleFuncResult = (result, resolve, reject) => {
  try {
    if (result.success) {
      resolve({ success: result.success });
    } else if (result.error) {
      reject({ error: result.error });
    } else {
      reject({ error: Error('You have not supplied a success or error response in your function.')});
    }
  } catch (err) { // Todo: test edgecase
    /* istanbul ignore next */
    reject({ error: err });
  }
};

export const handleFuncAsPromise: THandleFuncAsPromise = (response, resolve, reject) => {
  response
  .then(result => {
    resolve(result);
  })
  .catch((err: IExecOutput['error']) => {
    reject({ error: err });
  });
};

export const handleFunc: THandleFunc = (func, resolve, reject) => {
  const response: IObjSuccessOrError | TPromiseResponse = func();
  if (response instanceof Promise) {
    handleFuncAsPromise(response, resolve, reject);
  } else {
    const result: IObjSuccessOrError = response;
    handleFuncAsResult(result, resolve, reject);
  }
};
