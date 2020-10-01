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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const promiseExec_1 = require("src/promiseExec");
const promiseFunc_1 = require("src/promiseFunc");
const sync_1 = __importStar(require("src/sync"));
const resolve = jest.fn();
const reject = jest.fn();
const processResponse = promiseExec_1.handleExecOut({ cmd: 'echo steve' }, resolve, reject);
const timer = () => new Promise(resolve => {
    setTimeout(() => {
        resolve({ success: 'true' });
    }, 500);
});
describe('utils', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('catchProcess', () => {
        it('should run through all catch statements and return "then" method successfullly', () => __awaiter(void 0, void 0, void 0, function* () {
            const arrNext = [{ cmd: 'do thing' }, { cmd: 'do thing' }];
            const arrCatch = [
                { cmd: 'echo 1' },
                { cmd: 'echo 2' },
                { cmd: 'echo 3' }
            ];
            const intNextLen = arrNext.length;
            const intCatchLen = arrCatch.length;
            const errErrorOrObj = { error: Error('some error') };
            const result = yield sync_1.catchProcess({ arrNext, intNextLen, arrCatch,
                intCatchLen, errErrorOrObj });
            expect(result).toBe(true);
        }));
        it('should fail catch if no arrCatch exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const arrNext = [{ cmd: 'some error' }, { cmd: 'echo 2' }];
            const arrCatch = [];
            const intNextLen = arrNext.length;
            const intCatchLen = arrCatch.length;
            const errErrorOrObj = { error: Error('some error') };
            yield sync_1.catchProcess({ arrNext, intNextLen, arrCatch, intCatchLen, errErrorOrObj })
                .then(() => {
                expect(true).toBe(false);
            })
                .catch(err => {
                expect(true).toBe(true);
            });
        }));
    });
    describe('handleExecOut', () => {
        it('should expect error', () => {
            const error = Error('This failed!');
            const stdout = '';
            const stderr = '';
            processResponse(error, stdout, stderr);
            expect(reject).toHaveBeenCalled();
            expect(resolve).not.toHaveBeenCalled();
        });
        it('should expect success', () => {
            const error = null;
            const stdout = 'success';
            const stderr = '';
            processResponse(error, stdout, stderr);
            expect(resolve).toHaveBeenCalled();
            expect(reject).not.toHaveBeenCalled();
        });
    });
    describe('customProcess', () => {
        it('should run process successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const objCMD = {
                cmd: 'echo steve'
            };
            let success = false;
            yield sync_1.customProcess(objCMD)
                .then(() => {
                success = true;
                expect(success).toBe(true);
            })
                .catch(err => {
                success = false;
            });
        }));
        it('should run fail cmd', () => __awaiter(void 0, void 0, void 0, function* () {
            const objCMD = {
                cmd: 'npm run somethingthatdoesntexist'
            };
            let success = false;
            yield sync_1.customProcess(objCMD)
                .then(() => {
                success = true;
            })
                .catch(err => {
                success = false;
                expect(success).toBe(false);
            });
        }));
    });
    describe('getPosOfLen', () => {
        it('should return correct position - 1', () => {
            const arr = [{ cmd: 'do thing' }, { cmd: 'do thing' }, { cmd: 'do thing' }];
            expect(sync_1.getPosOfLen(arr, 3)).toBe('1');
        });
        it('should return correct position - 2', () => {
            const arr = [{ cmd: 'do thing' }, { cmd: 'do thing' }];
            expect(sync_1.getPosOfLen(arr, 3)).toBe('2');
        });
        it('should return correct position - 3', () => {
            const arr = [{ cmd: 'do thing' }];
            expect(sync_1.getPosOfLen(arr, 3)).toBe('3');
        });
        it('should return correct position - 3', () => {
            const arr = [];
            expect(sync_1.getPosOfLen(arr, 3)).toBe('3');
        });
    });
    describe('sync', () => {
        it('should run through sync method and catch methods and result in fail because 2nd cmd will always fail', () => __awaiter(void 0, void 0, void 0, function* () {
            const arrNext = [
                { cmd: 'echo 1' },
                {
                    cmd: 'fail something',
                    catch: [
                        { cmd: 'fail catch' },
                        {
                            func: timer
                        }
                    ]
                }
            ];
            const complete = yield sync_1.default(arrNext);
            expect(complete.isComplete).toBe(false);
        }));
        it('should fail if no objCMD exists in array', () => __awaiter(void 0, void 0, void 0, function* () {
            const arrNext = [{}];
            yield sync_1.default(arrNext)
                .then(() => {
                expect(true).toBe(false);
            })
                .catch(err => {
                expect(true).toBe(true);
            });
        }));
        it('should fail if no objCMD exists in array', () => __awaiter(void 0, void 0, void 0, function* () {
            const arrNext = [];
            yield sync_1.default(arrNext)
                .then(() => {
                expect(true).toBe(false);
            })
                .catch(err => {
                expect(true).toBe(true);
            });
        }));
        it('should fail if catch has no items in array', () => __awaiter(void 0, void 0, void 0, function* () {
            const arrNext = [
                {
                    cmd: 'do thing',
                    catch: []
                }
            ];
            yield sync_1.default(arrNext)
                .then(() => {
                expect(true).toBe(false);
            })
                .catch(err => {
                expect(true).toBe(true);
            });
        }));
        it('should run only one item in arrNext', () => __awaiter(void 0, void 0, void 0, function* () {
            const arrNext = [{ cmd: 'echo steve' }];
            yield sync_1.default(arrNext).then(() => {
                expect(true).toBe(true);
            });
        }));
        it('should pass to next in array and complete all processes', () => __awaiter(void 0, void 0, void 0, function* () {
            const arrNext = [{ cmd: 'echo steve' }, { cmd: 'echo steve' }];
            const result = yield sync_1.syncTry({ arrNext, intNextLen: arrNext.length, intNextCursor: 0 });
            expect(result).toBe(true);
        }));
    });
    describe('shallowCloneArrObjCMD', () => {
        it('should clone array - no catch', () => {
            const obj = [{
                    cmd: 'echo hello',
                }, {
                    cmd: 'echo hello',
                }];
            expect(sync_1.shallowCloneArrObjCMD(obj)).toEqual(obj);
        });
        it('should clone array - with catch', () => {
            const obj = [{
                    cmd: 'echo start',
                    catch: [{
                            func: () => ({ success: 'true' })
                        }, {
                            cmd: 'echo middle'
                        }, {
                            cmd: 'echo end',
                            msg: 'something else'
                        }]
                }];
            expect(sync_1.shallowCloneArrObjCMD(obj)).toEqual(obj);
        });
        it('should clone array - with catch has catch', () => {
            const obj = [{
                    catch: [{
                            func: () => ({ success: 'true' })
                        }, {
                            catch: [{ cmd: 'echo middle' }]
                        }]
                }];
            expect(sync_1.shallowCloneArrObjCMD(obj)).toEqual(obj);
        });
    });
    describe('getRejectWithoutObj', () => {
        it('should extract error from object', () => {
            const error = Error('some error');
            const objError = { error };
            expect(promiseFunc_1.getRejectWithoutObj(objError)).toEqual(error);
        });
        it('should just return error', () => {
            const error = Error('some error');
            expect(promiseFunc_1.getRejectWithoutObj(error)).toEqual(error);
        });
    });
    describe('getResolveWithoutObj', () => {
        it('should extract success from object', () => {
            const success = 'success';
            const objSuccess = { success };
            expect(promiseFunc_1.getResolveWithoutObj(objSuccess)).toEqual(success);
        });
        it('should just return success', () => {
            const success = 'success';
            expect(promiseFunc_1.getResolveWithoutObj(success)).toEqual(success);
        });
    });
});
//# sourceMappingURL=utils.test.js.map