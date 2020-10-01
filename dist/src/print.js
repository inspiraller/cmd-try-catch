"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const print = (msg, color) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(color ? chalk_1.default[color](msg) : msg);
    }
};
exports.default = print;
//# sourceMappingURL=print.js.map