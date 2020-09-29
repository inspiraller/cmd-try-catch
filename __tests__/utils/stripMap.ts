import { IObjCMD } from 'src/types';

type TStripMap = (arr: IObjCMD[]) => IObjCMD[];

const stripMap: TStripMap = arr => (
  arr.reduce((accum, curr) => {
    const catchme: IObjCMD[] = (curr.catch && stripMap(curr.catch)) || [];
    const objCMD: IObjCMD = { complete: curr.complete, catch: catchme };
    accum.push(objCMD);
    return accum;
  }, [] as IObjCMD[])
);

export default stripMap;
