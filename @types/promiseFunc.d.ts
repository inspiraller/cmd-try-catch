type TObjSuccessOrError = {
  success?: TObjSuccess['success'];
  error?: TObjError['error'];
};

type TFunc = () => TObjSuccessOrError | TPromiseResponse;

type THandleFunc = (func: TFunc, resolve: TResolveFunc, reject: TRejectFunc) => void;
type THandleFuncResult = (result: TObjSuccessOrError, resolve: TResolveFunc, reject: TRejectFunc) => void;
type THandleFuncAsPromise = (response: TPromiseResponse, resolve: TResolveFunc, reject: TRejectFunc) => void;
