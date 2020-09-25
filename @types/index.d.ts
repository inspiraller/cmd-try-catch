type TError = import('child_process').ExecException | null;
type ExecOptions =  import('child_process').ExecOptions;

type TSTDOut = string | Buffer;
type TExecOut = (error: TError, stdout: TSTDOut, stderr: TSTDOut) => void;

type TExecOutput = { 
  success?: TSTDOut;
  error?: TError;
};

type TObjSuccess =  {success: TExecOutput['success']};
type TObjError = {error: TExecOutput['error']};

type TResolveFunc = (value: TObjSuccess) => void;
type TRejectFunc= (value: TObjError) => void;

type TPromiseResponse = Promise<TObjSuccess>;
