import sync, {
  IObjCMD,
  TProcessResponseFunc,
  TError,
  TSTDOut,
  processPromiseHandler,
  customProcess,
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
      await customProcess(objCMD, isSpawn)
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
      await customProcess(objCMD, isSpawn)
        .then(() => {
          success = true;
        })
        .catch(err => {
          success = false;
          expect(success).toBe(false);
        });
    });
    it('should run fail cmd if no objCMD', async () => {
      let success: boolean = false;
      await customProcess(undefined)
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

  describe('catchProcess', () => {
    it('should run through all catch statements and return "then" method successfullly', async () => {
      const arrNext: IObjCMD[] = [{ cmd: 'do thing'}, {cmd: 'do thing'}];
      const arrCatch: IObjCMD[] = [{ cmd: 'do catch thing 1'}, {cmd: 'do catch thing 2'}, {cmd: 'do catch thing 3' }];
      const intNextLen: number = arrNext.length;
      const intCatchLen: number = arrCatch.length;

      await catchProcess(arrNext, intNextLen, arrCatch, intCatchLen).then(() => {
        expect(true).toBe(true);
      }).catch(err => {
        expect(true).toBe(false);
      });
    });
    it('should fail catch if no arrCatch exists', async () => {
      const arrNext: IObjCMD[] = [{ cmd: 'do thing'}, {cmd: 'do thing'}];
      const arrCatch: IObjCMD[] = [];
      const intNextLen: number = arrNext.length;
      const intCatchLen: number = arrCatch.length;

      await catchProcess(arrNext, intNextLen, arrCatch, intCatchLen).then(() => {
        expect(true).toBe(false);
      }).catch(err => {
        expect(true).toBe(true);
      });
    });
  });

  describe('sync', () => {
    it('should run through sync method and catch methods but result with success', async () => {
      const arrNext: IObjCMD[] = [
        { cmd: 'echo 1'}, 
        {
          cmd: 'fail something',
          catch: [
            { cmd: 'fail catch'},
            {
              func: () => {
                setTimeout(() => {
                  console.log('done');
                }, 1000)
              }
            }
          ]
        }
      ];
      await sync(arrNext).then(() => {
        expect(true).toBe(true);
      }).catch(err => {
        expect(true).toBe(false);
      });
    });
    it('should fail if no objCMD exists in array', async () => {
      const arrNext: IObjCMD[] = [{}];
      await sync(arrNext).then(() => {
        expect(true).toBe(false);
      }).catch(err => {
        expect(true).toBe(true);
      });
    });
    it('should fail if no objCMD exists in array', async () => {
      const arrNext: any= [];
      await sync(arrNext).then(() => {
        expect(true).toBe(false);
      }).catch(err => {
        expect(true).toBe(true);
      });
    });
    it('should fail if catch has no items in array', async () => {
      const arrNext: IObjCMD[] = [{
        cmd: 'do thing',
        catch: []
      }];
  
      await sync(arrNext).then(() => {
        expect(true).toBe(false);
      }).catch(err => {
        expect(true).toBe(true);
      });
    });
    it('should pass to next in array and complete all processes', async () => {
      const arrNext: IObjCMD[] = [{cmd: 'echo steve'}, { cmd: 'echo steve'}];
      await sync(arrNext).then(() => {
        expect(true).toBe(true);
      }).then(() => {
        expect(true).toBe(true);
      });
    });
  });
});
