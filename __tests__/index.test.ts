import sync, { TObjSuccessOrError } from 'bin/main';
import { TPromiseResponse } from 'bin/promiseExec';

const mock1Success = jest.fn<TObjSuccessOrError, any>(() => (
  {
    success: 'mock1Success'
  }
));

const mock2Error = jest.fn<TPromiseResponse, any>(() => new Promise ((_, reject) => {
  setTimeout(() => {
    reject({
      error: Error('mock2Error')
    });
  }, 2000);
}));

const mock3Success = jest.fn<TPromiseResponse, any>(() =>  new Promise (resolve => {
  setTimeout(() => {
    resolve({
      success: 'mock3Success'
    });
  }, 2000);
}));

let isComplete: boolean = false;

describe('sync', ()=> {
  describe('example 1', () => {
    beforeAll( async() => {
      jest.clearAllMocks();
      isComplete = await sync([
        {
          func: mock1Success
        },
        {
          func: mock2Error,
          catch: [
            {
              func: mock3Success
            }
          ]
        }
      ]);
    });
    it('should have called - mock1Success - once', () => {
      expect(mock1Success.mock.calls.length).toBe(1);
    });
    it('should have called - mock2Error - once', () => {
      expect(mock2Error.mock.calls.length).toBe(1);
    });
    it('should have called - mock3Success - once', () => {
      expect(mock3Success.mock.calls.length).toBe(1);
    });
    it('should complete', () => {
      expect(isComplete).toBe(true);
    });
  })
});

