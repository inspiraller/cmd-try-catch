"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleExecOut = void 0;
const child_process_1 = require("child_process");
const print_1 = __importDefault(require("./print"));
exports.handleExecOut = (objCMD, resolve, reject) => (error, stdout, stderr) => {
    if (error) {
        const objError = { error };
        objCMD.complete = objError;
        print_1.default(String(error), 'red');
        reject({ error });
    }
    else {
        const objSuccess = { success: stdout || stderr };
        objCMD.complete = objSuccess;
        resolve(objSuccess);
    }
};
const promiseExec = (objCMD, opt = {}) => new Promise((resolve, reject) => {
    child_process_1.exec(objCMD.cmd, opt, exports.handleExecOut(objCMD, resolve, reject));
});
exports.default = promiseExec;
//# sourceMappingURL=promiseExec.js.map