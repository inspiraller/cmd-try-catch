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
const urlExistPromise_1 = __importDefault(require("__tests__/utils/urlExistPromise"));
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    const exist = yield urlExistPromise_1.default('http://localhost/tutorial').catch(err => {
        console.log('err = ', err);
    });
    console.log('exist =', exist);
});
init();
//# sourceMappingURL=testurl.js.map