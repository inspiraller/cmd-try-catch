import sync from 'src/sync';


let isComplete: boolean = false;

describe('sync - cmd', () => {
  describe('error', () => {
    beforeAll( async() => {
      isComplete = await sync([
        {
          cmd: 'some error'
        }
      ]);
    });
    it('should not complete', () => {
      expect(isComplete).toBe(false);
    });
  });
  describe('error - success, error', () => {
    beforeAll( async() => {
      isComplete = await sync([
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
      expect(isComplete).toBe(false);
    });
  });
  describe(' success, error - error', () => {
    beforeAll( async() => {

      isComplete = await sync([
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
      expect(isComplete).toBe(false);
    });
  });
  describe('success', () => {
    beforeAll( async() => {
      isComplete = await sync([
        {
          cmd: 'echo success'
        }
      ]);
    });
    it('should complete', () => {
      expect(isComplete).toBe(true);
    });
  });
  describe('success, success', () => {
    beforeAll( async() => {
      isComplete = await sync([
        {
          cmd: 'echo success1'
        },
        {
          cmd: 'echo success2'
        }
      ]);
    });
    it('should complete', () => {
      expect(isComplete).toBe(true);
    });
  });
  describe('success, error - success', () => {
    beforeAll( async() => {
      isComplete = await sync([
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
      expect(isComplete).toBe(true);
    });
  });
  describe('error - success, success', () => {
    beforeAll( async() => {
      isComplete = await sync([
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
      expect(isComplete).toBe(true);
    });
  });
});
