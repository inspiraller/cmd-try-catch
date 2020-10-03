import { IObjCMD } from 'src/sync';

type TStripMapToObject = (arr: IObjCMD[]) => IObjCMD[];

const stripMapToObject: TStripMapToObject = arr =>
  arr.reduce((accum, curr) => {
    const catchme: IObjCMD[] = (curr.catch && stripMapToObject(curr.catch)) || [];
    const objCMD: IObjCMD = { complete: curr.complete, catch: catchme };
    accum.push(objCMD);
    return accum;
  }, [] as IObjCMD[]);

interface IObjCMDCompleteBool {
  complete: boolean | null;
  catch: IObjCMDCompleteBool[];
  func?: IObjCMD['func'];
  cmd?: IObjCMD['cmd'];
}

type TComplete = (complete: IObjCMD['complete']) => IObjCMDCompleteBool['complete'];

const getCompleteAsBool: TComplete = complete => {
  if (!complete) {
    return null;
  }
  return complete.success ? true : false;
};

type TStripMap = (arr: IObjCMD[], isCmd?: boolean) => IObjCMDCompleteBool[];
const stripMap: TStripMap = (arr, isCmd) =>
  arr.reduce((accum, curr) => {
    const catchme: IObjCMDCompleteBool[] = (curr.catch && stripMap(curr.catch, isCmd)) || [];
    const objCMD: IObjCMDCompleteBool = {
      complete: getCompleteAsBool(curr.complete),
      catch: catchme
    };
    if (isCmd) {
      if (curr.cmd) {
        objCMD.cmd = curr.cmd;
      } else if (curr.func) {
        objCMD.func = curr.func;
      }
    }
    accum.push(objCMD);
    return accum;
  }, [] as IObjCMDCompleteBool[]);
// ###################################################
// output example - simple:

/*

const objReturn = sync([{
  cmd: 'echo success',
}, {
  cmd: 'some error',
  catch: [{
    cmd: 'some error'
  }, {
    cmd: 'echo succes'
  }]
}, {
  cmd: 'echo success'
}])

const map = stripMap(objReturn.map) === 
[{
  complete: true
}, {
  complete: false,
  catch: [{
    complete: false
  }, {
    complete: true
  }]
}, {
  complete: true
}]

*/

// ###################################################
// output example - with isCmd === true = keeping the cmd relative to success to see.
/*
const isCmd = true;
const map = stripMap(objReturn.map, isCnd) === 
[{
  cmd: 'echo success'
  complete: true
}, {
  cmd: 'some error',
  complete: false,
  catch: [{
    cmd: 'some error',
    complete: false
  }, {
    cmd: 'echo succes',
    complete: true
  }]
}, {
  cmd: 'echo succes',
  complete: true
}]

*/

export { stripMapToObject };

export default stripMap;
