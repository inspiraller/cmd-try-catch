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
const promiseExec_1 = __importStar(require("src/promiseExec"));
describe('promiseExec - all', () => {
    describe('promiseExec', () => {
        it('should return promise {success: value}', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield promiseExec_1.default({ cmd: 'echo steve' });
            expect(response.success).toBeDefined();
            expect(response.success).toMatch(/steve/);
            expect(response.error).not.toBeDefined();
        }));
        it('should return promise {error: value}', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield promiseExec_1.default({ cmd: 'cmdThatDoesntExist arg' }).catch(err => {
                expect(err).toBeDefined();
            });
            expect(response && response.success).not.toBeDefined();
        }));
    });
    describe('handleExecOut', () => {
        it('should return {success: value}', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield new Promise((resolve, reject) => {
                promiseExec_1.handleExecOut({ cmd: 'echo success' }, resolve, reject)(null, '', 'success');
            });
            expect(response.success).toBeDefined();
            expect(response.success).toMatch(/success/);
            expect(response.error).not.toBeDefined();
        }));
        it('should return {error: value}', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield new Promise((resolve, reject) => {
                promiseExec_1.handleExecOut({ cmd: 'echo error' }, resolve, reject)(Error('some error'), '', '');
            }).catch(err => {
                expect(err).toBeDefined();
            });
            expect(response).not.toBeDefined();
        }));
    });
});
//# sourceMappingURL=promiseExec.test.js.map