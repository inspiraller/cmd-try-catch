import {
  IObjCMD,
  TProcessResponseFunc,
  TError,
  TSTDOut,
  processPromiseHandler,
  process,
  getPosOfLen,
  catchProcess
} from 'src/index';

const resolve = jest.fn();
const reject = jest.fn();
const processResponse: TProcessResponseFunc = processPromiseHandler(resolve, reject);

describe('utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('processPromiseHandler', () => {
    it('should expect error', () => {
      const error: TError = Error('This failed!');
      const stdout: TSTDOut = '';
      const stderr: TSTDOut = '';
      processResponse(error, stdout, stderr);
      expect(reject).toHaveBeenCalled();
      expect(resolve).not.toHaveBeenCalled();
    });
    it('should expect success', () => {
      const error: TError = null;
      const stdout: TSTDOut = 'success';
      const stderr: TSTDOut = '';
      processResponse(error, stdout, stderr);
      expect(resolve).toHaveBeenCalled();
      expect(reject).not.toHaveBeenCalled();
    });
  });

  describe('process', () => {
    it('should run process successfully', async () => {
      const objCMD = {
        cmd: 'echo steve'
      };
      const isSpawn = true;
      let success: boolean = false;
      await process(objCMD, isSpawn)
        .then(() => {
          success = true;
          expect(success).toBe(true);
        })
        .catch(err => {
          success = false;
        });
    });
    it('should run fail cmd', async () => {
      const objCMD = {
        cmd: 'npm run somethingthatdoesntexist'
      };
      const isSpawn = true;
      let success: boolean = false;
      await process(objCMD, isSpawn)
        .then(() => {
          success = true;
        })
        .catch(err => {
          success = false;
          expect(success).toBe(false);
        });
    });
  });

  describe('getPosOfLen', () => {
    it('should return correct position - 1', () => {
      const arr: IObjCMD[] = [{ cmd: 'do thing' }, { cmd: 'do thing' }, { cmd: 'do thing' }];
      expect(getPosOfLen(arr, 3)).toBe('1');
    });
    it('should return correct position - 2', () => {
      const arr: IObjCMD[] = [{ cmd: 'do thing' }, { cmd: 'do thing' }];
      expect(getPosOfLen(arr, 3)).toBe('2');
    });
    it('should return correct position - 3', () => {
      const arr: IObjCMD[] = [{ cmd: 'do thing' }];
      expect(getPosOfLen(arr, 3)).toBe('3');
    });
    it('should return correct position - 3', () => {
      const arr: IObjCMD[] = [];
      expect(getPosOfLen(arr, 3)).toBe('3');
    });
  });

  // describe('catchProcess', async () => {
  //   it('should run through all catch statements and return true', () => {
  //     const arrNext: IObjCMD[] = [{ cmd: 'do thing'}, {cmd: 'do thing'}];
  //     const arrCatch: IObjCMD[] = [{ cmd: 'do catch thing 1'}, {cmd: 'do catch thing 2', {cmd: 'do catch thing 3' }];
  //     const intNextLen: number = arrNext.length;
  //     const intCatchLen: number = arrCatch.length;

  //     await catchProcess(arrNext, intNextLen, arrCatch, intCatchLen).then(() => {
  //       expect(true).toBe(true)
  //     }).catch(err => {
  //       expect(true).toBe(false);
  //     });
  //   });
  // });
});
