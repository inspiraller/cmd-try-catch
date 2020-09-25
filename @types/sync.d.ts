declare namespace objCMD {
  // type IObjCMDFunc = import('./export/sync').IObjCMDFunc;
  // type IObjCMD = import('./export/sync').IObjCMD;
  export interface IObjCMDFunc {
    msg?: string;
    func: TFunc;
    complete?: IObjSuccessOrError
  }
  
  export interface IObjCMD {
    msg?: IObjCMDFunc['msg'];
    cmd?: string;
    func?: IObjCMDFunc['func'];
    catch?: IObjCMD[];
    complete?: IObjSuccessOrError
  }
}