import {TPromiseResponse, IObjSuccessOrError, ISyncReturn} from 'src/types';
import sync from 'src/sync';

const mockPromiseError = jest.fn<TPromiseResponse, any>(() => new Promise ((_, reject) => {
  setTimeout(() => {
    reject({
      error: Error('mockPromiseError')
    });
  }, 700);
}));

const mockPromiseSuccess = jest.fn<TPromiseResponse, any>(() =>  new Promise (resolve => {
  setTimeout(() => {
    resolve({
      success: 'mockPromiseSuccess'
    });
  }, 700);
}));


const mockSuccess1 = jest.fn<IObjSuccessOrError, any>(() => (
  {
    success: 'mockSuccess1'
  }
));

const mockSuccess2 = jest.fn<IObjSuccessOrError, any>(() => (
  {
    success: 'mockSuccess2'
  }
));

const mockError1 = jest.fn<IObjSuccessOrError, any>(() => (
  {
    error: Error('mockError1')
  }
));

const mockError2 = jest.fn<IObjSuccessOrError, any>(() => (
  {
    error: Error('mockError2')
  }
));

const obj: IObjSuccessOrError = {
  error: Error('mockError1')
};

delete obj.error;

const mockFuncNoSuccesOrError = jest.fn<IObjSuccessOrError, any>(() => (
  obj
));


let objReturn: ISyncReturn;

describe('sync - func', () => {
  describe('error', () => {
    beforeAll( async() => {
      jest.clearAllMocks();
      objReturn = await sync([
        {
          func: mockError1
        }
      ]);
    });
    it('should have called - mockError1 - once', () => {
      expect(mockError1.mock.calls.length).toBe(1);
    });
    it('should not complete', () => {
      expect(objReturn.isComplete).toBe(false);
    });
  });
  describe('Promise - error', () => {
    beforeAll( async() => {
      jest.clearAllMocks();
      objReturn = await sync([
        {
          func: mockPromiseError
        }
      ]);
    });
    it('should have called - mockPromiseError - once', () => {
      expect(mockPromiseError.mock.calls.length).toBe(1);
    });
    it('should not complete', () => {
      expect(objReturn.isComplete).toBe(false);
    });
  });
  describe('error - success, error', () => {
    beforeAll( async() => {
      jest.clearAllMocks();
      objReturn = await sync([
        {
          func: mockError1,
          catch: [
            {
              func: mockSuccess2
            }
          ]
        },
        {
          func: mockError2
        }
      ]);
    });
    it('should have called - mockError1 - once', () => {
      expect(mockError1.mock.calls.length).toBe(1);
    });
    it('should have called - mockSuccess2 - once', () => {
      expect(mockSuccess2.mock.calls.length).toBe(1);
    });
    it('should have called - mockError2 - once', () => {
      expect(mockError2.mock.calls.length).toBe(1);
    });
    it('should not complete', () => {
      expect(objReturn.isComplete).toBe(false);
    });
  });
  describe('success, error - error', () => {
    beforeAll( async() => {
      jest.clearAllMocks();
      objReturn = await sync([
        {
          func: mockSuccess1
        },
        {
          func: mockError1,
          catch: [
            {
              func: mockError2
            }
          ]
        },
        {
          func: mockSuccess2
        }
      ]);
    });
    it('should have called - mockSuccess1 - once', () => {
      expect(mockSuccess1.mock.calls.length).toBe(1);
    });
    it('should have called - mockError1 - once', () => {
      expect(mockError1.mock.calls.length).toBe(1);
    });
    it('should have called - mockError2 - once', () => {
      expect(mockError2.mock.calls.length).toBe(1);
    });
    it('should not have called - mockSuccess2', () => {
      expect(mockSuccess2.mock.calls.length).toBe(0);
    });
    it('should not complete', () => {
      expect(objReturn.isComplete).toBe(false);
    });
  });
  describe('handleFunc - unexpected error', () => {
    beforeAll( async() => {
      jest.clearAllMocks();
      objReturn = await sync([
        {
          func: mockFuncNoSuccesOrError // forcing unexpected error!
        }
      ]);
    });
    it('should have called - mockFuncNoSuccesOrError - once', () => {
      expect(mockFuncNoSuccesOrError.mock.calls.length).toBe(1);
    });
    it('should not complete', () => {
      expect(objReturn.isComplete).toBe(false);
    });
  });
  describe('success', () => {
    beforeAll( async() => {
      jest.clearAllMocks();
      objReturn = await sync([
        {
          func: mockSuccess1
        }
      ]);
    });
    it('should have called - mockSuccess1 - once', () => {
      expect(mockSuccess1.mock.calls.length).toBe(1);
    });
    it('should complete', () => {
      expect(objReturn.isComplete).toBe(true);
    });
  });
  describe('Promise - success', () => {
    beforeAll( async() => {
      jest.clearAllMocks();
      objReturn = await sync([
        {
          func: mockPromiseSuccess
        }
      ]);
    });
    it('should have called - mockPromiseSuccess - once', () => {
      expect(mockPromiseSuccess.mock.calls.length).toBe(1);
    });
    it('should complete', () => {
      expect(objReturn.isComplete).toBe(true);
    });
  });
  describe('success, success', () => {
    beforeAll( async() => {
      jest.clearAllMocks();
      objReturn = await sync([
        {
          func: mockSuccess1
        },
        {
          func: mockSuccess2
        }
      ]);
    });
    it('should have called - mockSuccess1 - once', () => {
      expect(mockSuccess1.mock.calls.length).toBe(1);
    });
    it('should have called - mockSuccess2 - once', () => {
      expect(mockSuccess2.mock.calls.length).toBe(1);
    });
    it('should complete', () => {
      expect(objReturn.isComplete).toBe(true);
    });
  });
  describe('success, error - success', () => {
    beforeAll( async() => {
      jest.clearAllMocks();
      objReturn = await sync([
        {
          func: mockSuccess1
        },
        {
          func: mockError1,
          catch: [
            {
              func: mockSuccess2
            }
          ]
        }
      ]);
    });
    it('should have called - mockSuccess1 - once', () => {
      expect(mockSuccess1.mock.calls.length).toBe(1);
    });
    it('should have called - mockError1 - once', () => {
      expect(mockError1.mock.calls.length).toBe(1);
    });
    it('should have called - mockSuccess2 - once', () => {
      expect(mockSuccess2.mock.calls.length).toBe(1);
    });
    it('should complete', () => {
      expect(objReturn.isComplete).toBe(true);
    });
  });
  describe('error - success, success', () => {
    beforeAll( async() => {
      jest.clearAllMocks();
      objReturn = await sync([
        {
          func: mockError1,
          catch: [
            {
              func: mockSuccess1
            }
          ]
        },
        {
          func: mockSuccess2
        }
      ]);
    });
    it('should have called - mockError1 - once', () => {
      expect(mockError1.mock.calls.length).toBe(1);
    });
    it('should have called - mockSuccess1 - once', () => {
      expect(mockSuccess2.mock.calls.length).toBe(1);
    });
    it('should have called - mockSuccess2 - once', () => {
      expect(mockSuccess2.mock.calls.length).toBe(1);
    });
    it('should complete', () => {
      expect(objReturn.isComplete).toBe(true);
    });
  });
});
