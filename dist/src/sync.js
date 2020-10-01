"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = exports.catchProcess = exports.syncCatch = exports.syncTry = exports.customProcess = exports.shallowCloneArrObjCMD = exports.getPosOfLen = void 0;
const child_process_1 = require("child_process");
const promiseExec_1 = require("./promiseExec");
const promiseFunc_1 = require("./promiseFunc");
const types = __importStar(require("./types"));
exports.types = types;
const chalk_1 = __importDefault(require("chalk"));
const print_1 = __importDefault(require("./print"));
const printTryCatch = (isTry, arr, len, msg) => {
    const intPos = exports.getPosOfLen(arr, len);
    const separator = isTry ? '                                                  ' : '';
    const color = 'cyan';
    print_1.default(chalk_1.default[color](separator));
    if (isTry) {
        print_1.default(chalk_1.default[color](`${intPos}: ${msg}`));
    }
    else {
        print_1.default(chalk_1.default[color](`CATCH: ${msg}`));
    }
};
exports.getPosOfLen = (arr, len) => arr.length ? `${len - (arr.length - 1)}` : String(len);
exports.shallowCloneArrObjCMD = (arrNext) => arrNext.reduce((accum, current) => {
    let objCMD = current;
    if (current.catch) {
        const { catch: aliasCatch } = current, rest = __rest(current, ["catch"]);
        const arrCatch = aliasCatch ? exports.shallowCloneArrObjCMD(aliasCatch) : [];
        objCMD = Object.assign(Object.assign({}, rest), { catch: arrCatch });
    }
    accum.push(Object.assign({}, objCMD));
    return accum;
}, []);
const getMsg = objCMD => {
    const { msg, cmd, func } = objCMD;
    const strMsg = msg || cmd || (func && !(func instanceof Promise) && func.name) || '';
    return strMsg;
};
exports.customProcess = (objCMD, opt = {}) => new Promise((resolve, reject) => {
    if (objCMD.func) {
        promiseFunc_1.handleFunc(objCMD, resolve, reject);
    }
    else {
        child_process_1.exec(objCMD.cmd, opt, promiseExec_1.handleExecOut(objCMD, resolve, reject));
    }
});
let sync;
let syncTry;
exports.syncTry = syncTry;
let catchProcess;
exports.catchProcess = catchProcess;
let syncCatch;
exports.syncCatch = syncCatch;
exports.catchProcess = catchProcess = ({ arrNext, intNextLen, arrCatch, intCatchLen, errErrorOrObj }) => __awaiter(void 0, void 0, void 0, function* () {
    const isCatch = arrCatch.length;
    if (isCatch) {
        const handleCatch = yield syncCatch({
            arrNext,
            intNextLen,
            arrCatch,
            intCatchLen,
            errErrorOrObj
        });
        return handleCatch;
    }
    print_1.default(chalk_1.default.bgRed(' ! Cannot continue ! no more catches'));
    return false;
});
const getTroubleshootCursor = (arrCatch, strError) => arrCatch.findIndex(objCMD => {
    const troubleshoot = objCMD.troubleshoot || null;
    return troubleshoot && strError.search(troubleshoot) !== -1;
});
const getCatchAny = arrCatch => arrCatch.findIndex((objCMD) => objCMD.complete === undefined);
const getCatchCursor = (arrCatch, errErrorOrObj) => {
    const strError = String(errErrorOrObj.error);
    const intTroubleshootInd = getTroubleshootCursor(arrCatch, strError);
    return (intTroubleshootInd === -1) ? getCatchAny(arrCatch) : intTroubleshootInd;
};
exports.syncCatch = syncCatch = ({ arrNext, intNextLen, arrCatch, intCatchLen, errErrorOrObj }) => __awaiter(void 0, void 0, void 0, function* () {
    const intCatchCursor = getCatchCursor(arrCatch, errErrorOrObj);
    if (intCatchCursor === -1) {
        return false;
    }
    const strMsg = getMsg(arrCatch[intCatchCursor]);
    printTryCatch(false, arrCatch, intCatchLen || 0, strMsg);
    const objCMD = arrCatch.slice(intCatchCursor, intCatchCursor + 1)[0];
    const catchAll = yield exports.customProcess(objCMD)
        .then(() => {
        return true;
    })
        .catch((err2) => __awaiter(void 0, void 0, void 0, function* () {
        const catchEach = yield catchProcess({
            arrNext,
            intNextLen,
            arrCatch,
            intCatchLen,
            errErrorOrObj: err2
        });
        return catchEach;
    }));
    return catchAll;
});
const getNext = (arrNext, intNextCursor) => intNextCursor < arrNext.length;
exports.syncTry = syncTry = ({ arrNext, intNextLen, intNextCursor }) => __awaiter(void 0, void 0, void 0, function* () {
    const strMsg = getMsg(arrNext[intNextCursor]);
    printTryCatch(true, arrNext, intNextLen, strMsg);
    const objCMD = arrNext[intNextCursor];
    if (!objCMD || !(objCMD.cmd || objCMD.func)) {
        print_1.default('Array has no objCMD', 'red');
        return false;
    }
    const arrCatch = objCMD.catch;
    const intCatchLen = (arrCatch && arrCatch.length) || 0;
    const tryAll = yield exports.customProcess(objCMD)
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        if (getNext(arrNext, intNextCursor + 1)) {
            const next = yield syncTry({ arrNext, intNextLen, intNextCursor: intNextCursor + 1 });
            return next;
        }
        return true;
    }))
        .catch((errErrorOrObj) => __awaiter(void 0, void 0, void 0, function* () {
        if (!arrCatch || !arrCatch.length) {
            return false;
        }
        const catchAll = yield catchProcess({
            arrNext,
            intNextLen,
            arrCatch,
            intCatchLen,
            errErrorOrObj
        });
        if (catchAll) {
            const next = yield syncTry({ arrNext, intNextLen, intNextCursor });
            return next;
        }
        return false;
    }));
    return tryAll;
});
sync = (arrNext) => __awaiter(void 0, void 0, void 0, function* () {
    const cloneArrNext = exports.shallowCloneArrObjCMD(arrNext);
    const intNextCursor = 0;
    const intNextLen = cloneArrNext.length;
    const isComplete = yield syncTry({ arrNext: cloneArrNext, intNextLen, intNextCursor });
    return {
        map: cloneArrNext,
        isComplete
    };
});
__exportStar(require("./types"), exports);
exports.default = sync;
//# sourceMappingURL=sync.js.map