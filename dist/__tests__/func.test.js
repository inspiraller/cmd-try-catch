"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sync_1 = __importDefault(require("src/sync"));
const mockPromiseError = jest.fn(() => new Promise((_, reject) => {
    setTimeout(() => {
        reject({
            error: Error('mockPromiseError')
        });
    }, 700);
}));
const mockPromiseSuccess = jest.fn(() => new Promise(resolve => {
    setTimeout(() => {
        resolve({
            success: 'mockPromiseSuccess'
        });
    }, 700);
}));
const mockSuccess1 = jest.fn(() => ({
    success: 'mockSuccess1'
}));
const mockSuccess2 = jest.fn(() => ({
    success: 'mockSuccess2'
}));
const mockError1 = jest.fn(() => ({
    error: Error('mockError1')
}));
const mockError2 = jest.fn(() => ({
    error: Error('mockError2')
}));
const obj = {
    error: Error('mockError1')
};
delete obj.error;
const mockFuncNoSuccesOrError = jest.fn(() => (obj));
let objReturn;
describe('sync - func', () => {
    describe('error', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            jest.clearAllMocks();
            objReturn = yield sync_1.default([
                {
                    func: mockError1
                }
            ]);
        }));
        it('should have called - mockError1 - once', () => {
            expect(mockError1.mock.calls.length).toBe(1);
        });
        it('should not complete', () => {
            expect(objReturn.isComplete).toBe(false);
        });
    });
    describe('Promise - error', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            jest.clearAllMocks();
            objReturn = yield sync_1.default([
                {
                    func: mockPromiseError
                }
            ]);
        }));
        it('should have called - mockPromiseError - once', () => {
            expect(mockPromiseError.mock.calls.length).toBe(1);
        });
        it('should not complete', () => {
            expect(objReturn.isComplete).toBe(false);
        });
    });
    describe('error - success, error', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            jest.clearAllMocks();
            objReturn = yield sync_1.default([
                {
                    func: mockError1,
                    catch: [
                        {
                            func: mockSuccess2
                        }
                    ]
                },
                {
                    func: mockError2
                }
            ]);
        }));
        it('should have called - mockError1 - twice', () => {
            expect(mockError1.mock.calls.length).toBe(2);
        });
        it('should have called - mockSuccess2 - once', () => {
            expect(mockSuccess2.mock.calls.length).toBe(1);
        });
        it('should not have called - mockError2', () => {
            expect(mockError2.mock.calls.length).toBe(0);
        });
        it('should not complete', () => {
            expect(objReturn.isComplete).toBe(false);
        });
    });
    describe('success, error - error', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            jest.clearAllMocks();
            objReturn = yield sync_1.default([
                {
                    func: mockSuccess1
                },
                {
                    func: mockError1,
                    catch: [
                        {
                            func: mockError2
                        }
                    ]
                },
                {
                    func: mockSuccess2
                }
            ]);
        }));
        it('should have called - mockSuccess1 - once', () => {
            expect(mockSuccess1.mock.calls.length).toBe(1);
        });
        it('should have called - mockError1 - once', () => {
            expect(mockError1.mock.calls.length).toBe(1);
        });
        it('should have called - mockError2 - once', () => {
            expect(mockError2.mock.calls.length).toBe(1);
        });
        it('should not have called - mockSuccess2', () => {
            expect(mockSuccess2.mock.calls.length).toBe(0);
        });
        it('should not complete', () => {
            expect(objReturn.isComplete).toBe(false);
        });
    });
    describe('handleFunc - unexpected error', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            jest.clearAllMocks();
            objReturn = yield sync_1.default([
                {
                    func: mockFuncNoSuccesOrError
                }
            ]);
        }));
        it('should have called - mockFuncNoSuccesOrError - once', () => {
            expect(mockFuncNoSuccesOrError.mock.calls.length).toBe(1);
        });
        it('should not complete', () => {
            expect(objReturn.isComplete).toBe(false);
        });
    });
    describe('success', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            jest.clearAllMocks();
            objReturn = yield sync_1.default([
                {
                    func: mockSuccess1
                }
            ]);
        }));
        it('should have called - mockSuccess1 - once', () => {
            expect(mockSuccess1.mock.calls.length).toBe(1);
        });
        it('should complete', () => {
            expect(objReturn.isComplete).toBe(true);
        });
    });
    describe('Promise - success', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            jest.clearAllMocks();
            objReturn = yield sync_1.default([
                {
                    func: mockPromiseSuccess
                }
            ]);
        }));
        it('should have called - mockPromiseSuccess - once', () => {
            expect(mockPromiseSuccess.mock.calls.length).toBe(1);
        });
        it('should complete', () => {
            expect(objReturn.isComplete).toBe(true);
        });
    });
    describe('success, success', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            jest.clearAllMocks();
            objReturn = yield sync_1.default([
                {
                    func: mockSuccess1
                },
                {
                    func: mockSuccess2
                }
            ]);
        }));
        it('should have called - mockSuccess1 - once', () => {
            expect(mockSuccess1.mock.calls.length).toBe(1);
        });
        it('should have called - mockSuccess2 - once', () => {
            expect(mockSuccess2.mock.calls.length).toBe(1);
        });
        it('should complete', () => {
            expect(objReturn.isComplete).toBe(true);
        });
    });
    describe('success, error - success', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            jest.clearAllMocks();
            objReturn = yield sync_1.default([
                {
                    func: mockSuccess1
                },
                {
                    func: mockError1,
                    catch: [
                        {
                            func: mockSuccess2
                        }
                    ]
                }
            ]);
        }));
        it('should have called - mockSuccess1 - once', () => {
            expect(mockSuccess1.mock.calls.length).toBe(1);
        });
        it('should have called - mockError1 - twice', () => {
            expect(mockError1.mock.calls.length).toBe(2);
        });
        it('should have called - mockSuccess2 - once', () => {
            expect(mockSuccess2.mock.calls.length).toBe(1);
        });
        it('should not complete', () => {
            expect(objReturn.isComplete).toBe(false);
        });
    });
    describe('error - success, success', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            jest.clearAllMocks();
            objReturn = yield sync_1.default([
                {
                    func: mockError1,
                    catch: [
                        {
                            func: mockSuccess1
                        }
                    ]
                },
                {
                    func: mockSuccess2
                }
            ]);
        }));
        it('should have called - mockError1 - twice', () => {
            expect(mockError1.mock.calls.length).toBe(2);
        });
        it('should have called - mockSuccess1 - once', () => {
            expect(mockSuccess1.mock.calls.length).toBe(1);
        });
        it('should not have called - mockSuccess2', () => {
            expect(mockSuccess2.mock.calls.length).toBe(0);
        });
        it('should not complete', () => {
            expect(objReturn.isComplete).toBe(false);
        });
    });
});
//# sourceMappingURL=func.test.js.map