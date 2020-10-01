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
const uuid_1 = require("uuid");
const child_process_1 = require("child_process");
const sync_1 = __importDefault(require("src/sync"));
const urlExistPromise_1 = require("./utils/urlExistPromise");
let objReturn;
const getUrlDockerTutorial = () => __awaiter(void 0, void 0, void 0, function* () { return yield urlExistPromise_1.urlExistPromiseAsObject('http://localhost/tutorial'); });
let id = uuid_1.v4();
describe('sync - usecase', () => {
    describe('Test if docker tutorial is running in localhost. Otherwise catch and run docker getting started, then retest', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            objReturn = yield sync_1.default([
                {
                    func: getUrlDockerTutorial,
                    catch: [
                        {
                            cmd: 'some error'
                        },
                        {
                            cmd: 'some error'
                        },
                        {
                            troubleshoot: /url\:\s\"http\:\/\/localhost\/tutorial\"\sdoes\snot\sexist/,
                            cmd: `docker run -d -p 80:80 --name ${id} docker/getting-started`
                        }
                    ]
                }
            ]);
        }));
        afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield child_process_1.exec(`docker stop ${id}`);
            yield child_process_1.exec(`docker rm ${id}`);
        }));
        it('should complete', () => {
            expect(objReturn.isComplete).toBe(true);
        });
    });
});
//# sourceMappingURL=troubleshoot.test.js.map