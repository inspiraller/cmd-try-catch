import util from 'util';
import {TFunc, ISyncReturn} from 'src/types';
import sync from 'src/sync';

const mock1Success: TFunc = () => (
  {
    success: 'mock1Success'
  }
);

const mock2Error: TFunc = () => new Promise ((_, reject) => {
  setTimeout(() => {
    reject({
      error: Error('mock2Error')
    });
  }, 2000);
});

const mock3Success: TFunc = () => new Promise (resolve => {
  setTimeout(() => {
    resolve({
      success: 'mock3Success'
    });
  }, 2000);
});

const mock4Success: TFunc = () => new Promise (resolve => {
  setTimeout(() => {
    resolve({
      success: 'mock4Success'
    });
  }, 2000);
});

const mock5Error: TFunc = () => new Promise ((_, reject) => {
  setTimeout(() => {
    reject({
      error: Error('mock5Error')
    });
  }, 2000);
});

const mock6Success: TFunc = () => new Promise (resolve => {
  setTimeout(() => {
    resolve({
      success: 'mock6Success'
    });
  }, 2000);
});

const mock7Success: TFunc = () => new Promise (resolve => {
  setTimeout(() => {
    resolve({
      success: 'mock7Success'
    });
  }, 2000);
});

const init =  async () => {
  const synced: ISyncReturn = await sync([
      {
        func: mock1Success,
        catch: [
          {
            func: mock2Error
          },
          {
            func: mock3Success
          },
          {
            func: mock4Success
          }
        ]
      },
      {
        func: mock5Error,
        catch: [
          {
            func: mock6Success
          }
        ]
      },
      {
        func: mock7Success
      }
    ]);
  const { isComplete, map } = synced;

  console.log('isComplete = ', isComplete);
  console.log('map = ', util.inspect(map, true, 4));
};

init();

