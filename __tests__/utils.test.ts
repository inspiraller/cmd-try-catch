import { handleExecOut } from 'src/promiseExec';
import { TError, IObjCMD, TSTDOut, TExecOut, TFunc, ISyncReturn } from 'src/types';
import sync, { customProcess, getPosOfLen, catchProcess, syncTry, shallowCloneArrObjCMD } from 'src/sync';

// troubleshoot - testing:
// https://github.com/nodejs/node-v0.x-archive/issues/25895

// - string literals in commands?
// C:\Windows\System32\ - add to environment variables system path
// - C:\Windows\System32\;

// https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
// - echo "use string"

const resolve = jest.fn();
const reject = jest.fn();
const processResponse: TExecOut = handleExecOut({cmd: 'echo steve'}, resolve, reject);

const timer: TFunc = () => new Promise(resolve => {
  setTimeout(() => {
    resolve({success: 'true'});
  }, 500);
});


describe('utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('catchProcess', () => {
    it('should run through all catch statements and return "then" method successfullly', async () => {
      const arrNext: IObjCMD[] = [{ cmd: 'do thing' }, { cmd: 'do thing' }];
      const arrCatch: IObjCMD[] = [
        { cmd: 'echo 1' },
        { cmd: 'echo 2' },
        { cmd: 'echo 3' }
      ];
      const intNextLen: number = arrNext.length;
      const intCatchLen: number = arrCatch.length;
      const result: boolean | void = await catchProcess({ arrNext, intNextLen, arrCatch, intCatchLen, intCatchCursor: 0 });
      expect(result).toBe(true);
    });
    it('should fail catch if no arrCatch exists', async () => {
      const arrNext: IObjCMD[] = [{ cmd: 'some error' }, { cmd: 'echo 2' }];
      const arrCatch: IObjCMD[] = [];
      const intNextLen: number = arrNext.length;
      const intCatchLen: number = arrCatch.length;

      await catchProcess({ arrNext, intNextLen, arrCatch, intCatchLen, intCatchCursor: 0 })
        .then(() => {
          expect(true).toBe(false); // should not get here, and if it does - show error
        })
        .catch(err => {
          expect(true).toBe(true);
        });
    });
  });

  describe('handleExecOut', () => {
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

  describe('customProcess', () => {
    it('should run process successfully', async () => {
      const objCMD = {
        cmd: 'echo steve'
      };
      let success: boolean = false;
      await customProcess(objCMD)
        .then(() => {
          success = true;
          expect(success).toBe(true); // todo - move this out of await method
        })
        .catch(err => {
          success = false;
        });
    });
    it('should run fail cmd', async () => {
      const objCMD = {
        cmd: 'npm run somethingthatdoesntexist'
      };
      let success: boolean = false;
      await customProcess(objCMD)
        .then(() => {
          success = true;
        })
        .catch(err => {
          success = false;
          expect(success).toBe(false); // todo - move this out of await method
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

  describe('sync', () => {
    it('should run through sync method and catch methods and result in fail because 2nd cmd will always fail', async () => {
      const arrNext: IObjCMD[] = [
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
      const complete: ISyncReturn = await sync(arrNext);
        // .then(() => {
        //   expect(true).toBe(true);
        // })
        // .catch(err => {
        //   expect(true).toBe(false);
        // });
      expect(complete.isComplete).toBe(false);
    });
    it('should fail if no objCMD exists in array', async () => {
      const arrNext: IObjCMD[] = [{}];
      await sync(arrNext)
        .then(() => {
          expect(true).toBe(false);
        })
        .catch(err => {
          expect(true).toBe(true);
        });
    });
    it('should fail if no objCMD exists in array', async () => {
      const arrNext: any = [];
      await sync(arrNext)
        .then(() => {
          expect(true).toBe(false);
        })
        .catch(err => {
          expect(true).toBe(true);
        });
    });
    it('should fail if catch has no items in array', async () => {
      const arrNext: IObjCMD[] = [
        {
          cmd: 'do thing',
          catch: []
        }
      ];

      await sync(arrNext)
        .then(() => {
          expect(true).toBe(false);
        })
        .catch(err => {
          expect(true).toBe(true);
        });
    });
    it('should run only one item in arrNext', async () => {
      const arrNext: IObjCMD[] = [{ cmd: 'echo steve' }];
      await sync(arrNext).then(() => {
        expect(true).toBe(true);
      });
    });
    it('should pass to next in array and complete all processes', async () => {
      const arrNext: IObjCMD[] = [{ cmd: 'echo steve' }, { cmd: 'echo steve' }];
      const result = await syncTry({ arrNext, intNextLen: arrNext.length, intNextCursor: 0 });
      expect(result).toBe(true);
    });
  });
  describe('shallowCloneArrObjCMD', () => {
    
// shallowCloneArrObjCMD () - notes:
//   Will only clone single level - [{key: value, catch: [{key: value}]}]
//   Won't clone deeper level - [{key: {deepkey: value}, catch: [{key: {deepkey: value}}]}]
//   it will nested catch - [{key: {deepkey: value}, catch: [{catch [{deepkey: value}]}]}]

    it('should clone array - no catch', () => {
      const obj: IObjCMD[] = [{
        cmd: 'echo hello',
      }, {
        cmd: 'echo hello',
      }];
      expect(shallowCloneArrObjCMD(obj)).toEqual(obj);
    });
    it('should clone array - with catch', () => {
      const obj: IObjCMD[] = [{
        cmd: 'echo start',
        catch: [{
          func: () => ({success: 'true'})
        }, {
          cmd: 'echo middle'
        }, {
          cmd: 'echo end',
          msg: 'something else'
        }]
      }];
      expect(shallowCloneArrObjCMD(obj)).toEqual(obj);
    });
    it('should clone array - with catch has catch', () => {
      const obj: IObjCMD[] = [{
        catch: [{
          func: () => ({success: 'true'})
        }, {
          catch: [{cmd:'echo middle'}]
        }]
      }];
      expect(shallowCloneArrObjCMD(obj)).toEqual(obj);
    });
  })
});
