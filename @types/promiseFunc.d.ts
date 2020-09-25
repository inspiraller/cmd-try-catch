interface IObjSuccessOrError {
  success?: IObjSuccess['success'];
  error?: IObjError['error'];
}

type TFunc = () => IObjSuccessOrError | TPromiseResponse;

type THandleFunc = (func: TFunc, resolve: TResolveFunc, reject: TRejectFunc) => void;
type THandleFuncResult = (result: IObjSuccessOrError, resolve: TResolveFunc, reject: TRejectFunc) => void;
type THandleFuncAsPromise = (response: TPromiseResponse, resolve: TResolveFunc, reject: TRejectFunc) => void;
