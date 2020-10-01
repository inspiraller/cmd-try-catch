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
exports.urlExistPromiseAsObject = void 0;
const url_exist_1 = __importDefault(require("url-exist"));
const constructError = url => `url: "${url}" does not exist`;
const urlExistPromiseAsObject = (url) => __awaiter(void 0, void 0, void 0, function* () {
    return yield new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const exist = yield url_exist_1.default(url);
        if (exist) {
            resolve({
                success: 'true'
            });
        }
        else {
            reject({
                error: Error(constructError(url))
            });
        }
    }));
});
exports.urlExistPromiseAsObject = urlExistPromiseAsObject;
const urlExistPromise = (url) => __awaiter(void 0, void 0, void 0, function* () {
    return yield new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const exist = yield url_exist_1.default(url);
        if (exist) {
            resolve(true);
        }
        else {
            reject(Error(constructError(url)));
        }
    }));
});
exports.default = urlExistPromise;
//# sourceMappingURL=urlExistPromise.js.map