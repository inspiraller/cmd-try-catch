/* shared */
export type TError = import('child_process').ExecException | null;
export type ExecOptions =  import('child_process').ExecOptions;

export type TSTDOut = string | Buffer;
export type TExecOut = (error: TError, stdout: TSTDOut, stderr: TSTDOut) => void;

export interface IExecOutput { 
  success?: TSTDOut;
  error?: TError;
}

export interface IObjSuccess {success: IExecOutput['success']}
export interface IObjError {error: IExecOutput['error']}

export type TResolveFunc = (value: IObjSuccess) => void;
export type TRejectFunc= (value: IObjError) => void;

export type TPromiseResponse = Promise<IObjSuccess>;

/* exec */
export type THandleExecOut = (
  objCMD: IObjCMDExec,
  resolve: TResolveFunc,
  reject: TRejectFunc
) => TExecOut;

export type TPromiseExec = (objCMD: IObjCMDExec, opt?: ExecOptions) => TPromiseResponse;

/* promiseFunc */
export type TFunc = () => IObjSuccessOrError | TPromiseResponse;
export type THandleFunc = (objCMD: IObjCMDFunc, resolve: TResolveFunc, reject: TRejectFunc) => void;
export type THandleFuncResult = (
  objCMD: IObjCMD,
  result: IObjSuccessOrError,
  resolve: TResolveFunc,
  reject: TRejectFunc
) => void;

export type THandleFuncAsPromise = (
  objCMD: IObjCMD,
  response: TPromiseResponse,
  resolve: TResolveFunc,
  reject: TRejectFunc
) => void;

/* sync */
export interface IObjCMDFunc {
  msg?: string;
  func: TFunc;
  complete?: IObjSuccessOrError
}

export interface IObjCMDExec {
  msg?: string;
  cmd: string;
  complete?: IObjSuccessOrError
}

export interface IObjCMD {
  msg?: IObjCMDFunc['msg'];
  cmd?: string;
  func?: IObjCMDFunc['func'];
  catch?: IObjCMD[];
  complete?: IObjSuccessOrError
}

export interface IObjSuccessOrError {
  success?: IObjSuccess['success'];
  error?: IObjError['error'];
}

interface ISync {
  arrNext: IObjCMD[];
}

export type ISyncReturn = {
  isComplete: boolean;
  map: IObjCMD[];
}

interface ISyncTry extends ISync {
  intNextCursor: number;
  intNextLen: number;
  arrCatch?: IObjCMD[];
  intCatchLen?: number;
}

interface ISyncCatch extends ISync {
  intCatchCursor: number;
  intNextLen: number;
  arrCatch: IObjCMD[];
  intCatchLen: number;
}

export type TSync = (arrNext: ISync['arrNext']) => Promise<ISyncReturn>;

export type TSyncTry = (props: ISyncTry) => Promise<boolean>;
export type TSyncCatch = (props: ISyncCatch) => Promise<boolean>;

export type TProcess = (objCMD: IObjCMD, opt?: ExecOptions) => TPromiseResponse;

export type TGetMsg = (objCMD: IObjCMD) => string;