type THandleExecOut = (
  resolve: TResolveFunc,
  reject: TRejectFunc
) => TExecOut;


type TPromiseExec = (cmd: string, opt?: ExecOptions) => TPromiseResponse;
