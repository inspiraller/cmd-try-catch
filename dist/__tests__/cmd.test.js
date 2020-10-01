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
const stripMap_1 = __importDefault(require("./utils/stripMap"));
let objReturn;
describe('sync - cmd', () => {
    describe('error', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            objReturn = yield sync_1.default([
                {
                    cmd: 'some error'
                }
            ]);
        }));
        it('should not complete', () => {
            expect(objReturn.isComplete).toBe(false);
        });
        it('map response should match', () => {
            expect(stripMap_1.default(objReturn.map)).toMatchObject([{ complete: false }]);
        });
    });
    describe('error - success, error', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            objReturn = yield sync_1.default([
                {
                    cmd: 'some error1',
                    catch: [
                        {
                            cmd: 'echo success'
                        }
                    ]
                },
                {
                    cmd: 'some error2'
                }
            ]);
        }));
        it('should not complete', () => {
            expect(objReturn.isComplete).toBe(false);
        });
        it('map response should match', () => {
            expect(stripMap_1.default(objReturn.map)).toMatchObject([{
                    complete: false,
                    catch: [{
                            complete: true
                        }]
                }, {
                    complete: null
                }]);
        });
    });
    describe(' success, error - error', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            objReturn = yield sync_1.default([
                {
                    cmd: 'echo success'
                },
                {
                    cmd: 'some error1',
                    catch: [
                        {
                            cmd: 'some error2'
                        }
                    ]
                },
                {
                    cmd: 'never gets here'
                }
            ]);
        }));
        it('should not complete', () => {
            expect(objReturn.isComplete).toBe(false);
        });
        it('map response should match', () => {
            expect(stripMap_1.default(objReturn.map)).toMatchObject([{
                    complete: true,
                }, {
                    complete: false,
                    catch: [{
                            complete: false
                        }]
                }, {
                    complete: null
                }]);
        });
    });
    describe('success', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            objReturn = yield sync_1.default([
                {
                    cmd: 'echo success'
                }
            ]);
        }));
        it('should complete', () => {
            expect(objReturn.isComplete).toBe(true);
        });
    });
    describe('success, success', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            objReturn = yield sync_1.default([
                {
                    cmd: 'echo success1'
                },
                {
                    cmd: 'echo success2'
                }
            ]);
        }));
        it('should complete', () => {
            expect(objReturn.isComplete).toBe(true);
        });
    });
    describe('success, error - success', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            objReturn = yield sync_1.default([
                {
                    cmd: 'echo success1'
                },
                {
                    cmd: 'some error',
                    catch: [
                        {
                            cmd: 'echo success2'
                        }
                    ]
                }
            ]);
        }));
        it('should not complete', () => {
            expect(objReturn.isComplete).toBe(false);
        });
    });
    describe('error - success, success', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            objReturn = yield sync_1.default([
                {
                    cmd: 'some error',
                    catch: [
                        {
                            cmd: 'echo success1'
                        }
                    ]
                },
                {
                    cmd: 'echo success2'
                }
            ]);
        }));
        it('should not complete', () => {
            expect(objReturn.isComplete).toBe(false);
        });
    });
});
//# sourceMappingURL=cmd.test.js.map