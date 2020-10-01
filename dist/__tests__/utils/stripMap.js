"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripMapToObject = void 0;
const stripMapToObject = arr => (arr.reduce((accum, curr) => {
    const catchme = (curr.catch && stripMapToObject(curr.catch)) || [];
    const objCMD = { complete: curr.complete, catch: catchme };
    accum.push(objCMD);
    return accum;
}, []));
exports.stripMapToObject = stripMapToObject;
const getCompleteAsBool = complete => {
    if (!complete) {
        return null;
    }
    return complete.success ? true : false;
};
const stripMap = (arr, isCmd) => (arr.reduce((accum, curr) => {
    const catchme = (curr.catch && stripMap(curr.catch, isCmd)) || [];
    const objCMD = { complete: getCompleteAsBool(curr.complete), catch: catchme };
    if (isCmd) {
        if (curr.cmd) {
            objCMD.cmd = curr.cmd;
        }
        else if (curr.func) {
            objCMD.func = curr.func;
        }
    }
    accum.push(objCMD);
    return accum;
}, []));
exports.default = stripMap;
//# sourceMappingURL=stripMap.js.map