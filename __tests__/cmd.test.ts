import { ISyncReturn } from 'src/types';
import sync from 'src/sync';
import stripMap from './utils/stripMap';

let objReturn: ISyncReturn;

describe('sync - cmd', () => {
  describe('error', () => {
    beforeAll(async () => {
      objReturn = await sync([
        {
          cmd: 'some error'
        }
      ]);
    });
    it('should not complete', () => {
      expect(objReturn.isComplete).toBe(false);
    });
    it('map response should match', () => {
      expect(stripMap(objReturn.map)).toMatchObject([
        {
          complete: {
            error: {
              cmd: 'some error'
            }
          }
        }
      ]);
    });
  });
  describe('error - success, error', () => {
    beforeAll(async () => {
      objReturn = await sync([
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
    });
    it('should not complete', () => {
      expect(objReturn.isComplete).toBe(false);
    });
    it('map response should match', () => {
      expect(stripMap(objReturn.map)).toMatchObject([{
        complete: {
          error: {
            cmd: 'some error1'
          }
        },
        catch: [{
          complete: {
            success: /success\s*/
          }
        }]
      }, {
        complete: {
          error: {
            cmd: 'some error2'
          }
        }
      }]);
    });
    // it('map response should have error [0]{complete: {error}}] && [0][0]{complete: {success}}] && [1]{complete: {error}}]', () => {
    //   const complete0: IObjSuccessOrError = objReturn.map[0].complete as IObjSuccessOrError;
    //   const catch
    //   const complete00: IObjSuccessOrError = objReturn.map[0].catch[0].complete as IObjSuccessOrError;
    //   const complete1: IObjSuccessOrError = objReturn.map[0].complete as IObjSuccessOrError;
    //   expect(complete0.error).toBeDefined();
    //   expect(complete00.success).toBeDefined();
    //   expect(complete1.error).toBeDefined();
    // });
  });
  describe(' success, error - error', () => {
    beforeAll(async () => {
      objReturn = await sync([
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
    });
    it('should not complete', () => {
      expect(objReturn.isComplete).toBe(false);
    });
    // it('map response should have success, error - error', () => {
    //   const complete0: IObjSuccessOrError = objReturn.map[0].complete as IObjSuccessOrError;
    //   const complete1: IObjSuccessOrError = objReturn.map[1].complete as IObjSuccessOrError;
    //   const complete10: IObjSuccessOrError = objReturn.map[1].catch[0].complete as IObjSuccessOrError;
    //   expect(complete0.error).toBeDefined();
    //   expect(complete00.success).toBeDefined();
    //   expect(complete1.error).toBeDefined();
    // });
  });
  describe('success', () => {
    beforeAll(async () => {
      objReturn = await sync([
        {
          cmd: 'echo success'
        }
      ]);
    });
    it('should complete', () => {
      expect(objReturn.isComplete).toBe(true);
    });
  });
  describe('success, success', () => {
    beforeAll(async () => {
      objReturn = await sync([
        {
          cmd: 'echo success1'
        },
        {
          cmd: 'echo success2'
        }
      ]);
    });
    it('should complete', () => {
      expect(objReturn.isComplete).toBe(true);
    });
  });
  describe('success, error - success', () => {
    beforeAll(async () => {
      objReturn = await sync([
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
    });
    it('should complete', () => {
      expect(objReturn.isComplete).toBe(true);
    });
  });
  describe('error - success, success', () => {
    beforeAll(async () => {
      objReturn = await sync([
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
    });
    it('should complete', () => {
      expect(objReturn.isComplete).toBe(true);
    });
  });
});
