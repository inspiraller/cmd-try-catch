import sync, { ISyncReturn } from 'src/sync';
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
      expect(stripMap(objReturn.map)).toMatchObject([{ complete: false }]);
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
      expect(stripMap(objReturn.map)).toMatchObject([
        {
          complete: false, // gets retried
          catch: [
            {
              complete: true
            }
          ]
        },
        {
          complete: null
        }
      ]);
    });
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
    it('map response should match', () => {
      expect(stripMap(objReturn.map)).toMatchObject([
        {
          complete: true
        },
        {
          complete: false,
          catch: [
            {
              complete: false
            }
          ]
        },
        {
          complete: null
        }
      ]);
    });
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
    it('should not complete', () => {
      expect(objReturn.isComplete).toBe(false);
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
    it('should not complete', () => {
      expect(objReturn.isComplete).toBe(false);
    });
  });
});
