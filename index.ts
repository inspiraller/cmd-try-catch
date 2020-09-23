import sync, { TFunc } from 'bin/main';
// import { TExecOut } from 'bin/promiseExec';

const experimentEcho1: TFunc = () => (
  {
    success: 'experimentEcho1'
  }
);

const experimentEcho2: TFunc = new Promise ((_, reject) => {
  setTimeout(() => {
    reject({
      error: Error('mock error experimentEcho2')
    });
  }, 2000);
});

const experimentEcho3: TFunc = new Promise (resolve => {
  setTimeout(() => {
    resolve({
      success: 'success'
    });
  }, 2000);
});

const experimentEcho4: TFunc = new Promise (resolve => {
  setTimeout(() => {
    resolve({
      success: 'success'
    });
  }, 2000);
});

const experimentEcho5: TFunc = new Promise ((_, reject) => {
  setTimeout(() => {
    reject({
      error: Error('echo 5 fails')
    });
  }, 2000);
});

const experimentEcho6: TFunc = new Promise (resolve => {
  setTimeout(() => {
    resolve({
      success: 'success'
    });
  }, 2000);
});

const experimentEcho7: TFunc = new Promise (resolve => {
  setTimeout(() => {
    resolve({
      success: 'success'
    });
  }, 2000);
});

let isComplete: boolean = false;

const init =  async () => {
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
      },
      {
        func: experimentEcho7
      }
    ]);
};

init();

