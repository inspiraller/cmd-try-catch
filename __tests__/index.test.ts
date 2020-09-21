import sync, { TProcessResponseFunc } from 'src/index';


const experimentEcho1 = jest.fn((handle: TProcessResponseFunc) => {
  const error = Error('mock error experimentEcho1');
  const stdout = 'experimentEcho1';
  const stderr = '';
  setTimeout(() => {
    handle(error, stdout, stderr);
  }, 2000);
});

const experimentEcho2 = jest.fn((handle: TProcessResponseFunc) => {
  const error = Error('mock error experimentEcho2');
  const stdout = 'experimentEcho2';
  const stderr = '';
  setTimeout(() => {
    handle(error, stdout, stderr);
  }, 2000);
});

const experimentEcho3 = jest.fn((handle: TProcessResponseFunc) => {
  const error = null;
  const stdout = 'success';
  const stderr = '';
  handle(error, stdout, stderr);
});

const experimentEcho4 = jest.fn((handle: TProcessResponseFunc) => {
  const error = null;
  const stdout = 'success';
  const stderr = '';
  handle(error, stdout, stderr);
});

const experimentEcho5 = jest.fn((handle: TProcessResponseFunc) => {
  const error = Error('echo 5 fails');
  const stdout = 'success';
  const stderr = '';
  handle(error, stdout, stderr);
});

const experimentEcho6 = jest.fn((handle: TProcessResponseFunc) => {
  const error = null;
  const stdout = 'success';
  const stderr = '';
  handle(error, stdout, stderr);
});

let isComplete: boolean = false;

describe('index', () => {
  describe('sync combination 1', ()=> {
    beforeAll( async() => {
      isComplete = await sync([
        {
          func: experimentEcho1,
          catch: [
            {
              func: experimentEcho2
            },
            {
              func: experimentEcho3
            },
            {
              func: experimentEcho4
            }
          ]
        },
        {
          func: experimentEcho5,
          catch: [
            {
              func: experimentEcho6
            }
          ]
        }
      ]);
      console.log('isComplete = ', isComplete);
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
