
import { exec, ExecException, ExecOptions } from 'child_process';
import print from './print';

export type TError = ExecException | null;
export type TSTDOut = string | Buffer;
export type TExecOut = (error: TError, stdout: TSTDOut, stderr: TSTDOut) => void;

export type TExecOutput = { 
  success?: TSTDOut;
  error?: TError;
};

export type TObjSuccess =  {success: TExecOutput['success']};
export type TObjError = {error: TExecOutput['error']};

export type TResolveFunc = (value: TObjSuccess) => void;
export type TRejectFunc= (value: TObjError) => void;

export type TPromiseResponse = Promise<TObjSuccess>;

export type THandleExecOut = (
  resolve: TResolveFunc,
  reject: TRejectFunc
) => TExecOut;


export type TPromiseExec = (cmd: string, opt?: ExecOptions) => TPromiseResponse;

export const handleExecOut: THandleExecOut = (resolve, reject) => (
  error,
  stdout,
  stderr
) => {
  if (error) {
    print(String(error), 'red');
    reject({ error });
  } else {
    resolve({ success: stdout || stderr });
  }
};

const promiseExec: TPromiseExec = (cmd, opt = {}) => new Promise((resolve, reject) => {
  exec(cmd, opt, handleExecOut(resolve, reject));
});

export default promiseExec;
