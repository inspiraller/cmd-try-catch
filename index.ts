import sync, { TProcessResponseFunc } from 'bin/main';

const experimentEcho1 = (handle: TProcessResponseFunc) => {
  const error = Error('mock error experimentEcho1');
  const stdout = 'experimentEcho1';
  const stderr = '';
  setTimeout(() => {
    handle(error, stdout, stderr);
  }, 2000);
};

const experimentEcho2 = (handle: TProcessResponseFunc) => {
  const error = Error('mock error experimentEcho2');
  const stdout = 'experimentEcho2';
  const stderr = '';
  setTimeout(() => {
    handle(error, stdout, stderr);
  }, 2000);
};

const experimentEcho3 = (handle: TProcessResponseFunc) => {
  const error = null;
  const stdout = 'success';
  const stderr = '';
  handle(error, stdout, stderr);
};

const experimentEcho4 = (handle: TProcessResponseFunc) => {
  const error = null;
  const stdout = 'success';
  const stderr = '';
  handle(error, stdout, stderr);
};

const experimentEcho5 = (handle: TProcessResponseFunc) => {
  const error = Error('echo 5 fails');
  const stdout = 'success';
  const stderr = '';
  handle(error, stdout, stderr);
};

const experimentEcho6 = (handle: TProcessResponseFunc) => {
  const error = null;
  const stdout = 'success';
  const stderr = '';
  handle(error, stdout, stderr);
};

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
      }
    ]);
  console.log('isComplete = ', isComplete);
};

init();

