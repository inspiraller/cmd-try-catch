type TError = import('child_process').ExecException | null;
type ExecOptions =  import('child_process').ExecOptions;

type TSTDOut = string | Buffer;
type TExecOut = (error: TError, stdout: TSTDOut, stderr: TSTDOut) => void;

interface IExecOutput { 
  success?: TSTDOut;
  error?: TError;
}

interface IObjSuccess {success: IExecOutput['success']}
interface IObjError {error: IExecOutput['error']}

type TResolveFunc = (value: IObjSuccess) => void;
type TRejectFunc= (value: IObjError) => void;

type TPromiseResponse = Promise<IObjSuccess>;
