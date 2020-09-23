import sync, { TFunc } from 'bin/main';

const mockSuccess: TFunc = () => ({
  success: 'mockSuccess'
});

const mockError: TFunc = () => ({
  error: Error('This method fails!!!')
});

let isComplete: boolean = false;

describe('index', () => {
  describe('sync combination 1', ()=> {
    beforeAll( async() => {
      isComplete = await sync([
        {
          func: mockError,
          catch: [
            {
              func: mockError
            },
            {
              func: mockSuccess
            },
            {
              func: mockError
            }
          ]
        },
        {
          func: mockError,
          catch: [
            {
              func: mockSuccess
            }
          ]
        }
      ]);
    });
  
    it('should try - experimentEcho1', () => {
      expect(experimentEcho1.mock.calls.length).toBe(1);
    });
    it('should catch - experimentEcho2', () => {
      expect(experimentEcho2.mock.calls.length).toBe(1);
    });
    it('should catch - experimentEcho3', () => {
      expect(experimentEcho3.mock.calls.length).toBe(1);
    });
    it('should "Not" catch - experimentEcho4', () => {
      expect(experimentEcho4.mock.calls.length).toBe(0);
    });
    it('should try - experimentEcho5', () => {
      expect(experimentEcho5.mock.calls.length).toBe(1);
    });
    it('should catch - experimentEcho6', () => {
      expect(experimentEcho6.mock.calls.length).toBe(1);
    });
    it('should have completed transaction successfully', () => {
      expect(isComplete).toBe(true);
    });
  });
})
