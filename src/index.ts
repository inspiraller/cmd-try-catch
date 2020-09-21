const { spawn, exec } = require('child_process');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const defaultOptions = {
  stdio: 'inherit',
  shell: true,
  cwd: './'
};

const print = msg => console.info(msg);

const defaultHandle = (msg, resolve, reject) => (error, stdout, stderr) => {
  // print(chalk.grey(` - ${msg}`));
  if (error) {
    print(chalk.grey(error));
    reject(error);
  } else {
    print(chalk.grey(stdout));
    resolve(stdout || stderr);
  }
};

const process = (objCMD, isSpawn = false) => {
  const { cmd, msg } = objCMD;
  return new Promise((resolve, reject) => {
    if (objCMD.func) {
      return objCMD.func(defaultHandle(msg, resolve, reject));
    }
    return isSpawn
      ? spawn(cmd, defaultOptions, defaultHandle(msg, resolve, reject))
      : exec(cmd, defaultOptions, defaultHandle(msg, resolve, reject));
  });
};

const removeDockerMachine = async () => {
  const removed = await process('docker-machine rm -f default', 'remove docker-machine');
  return removed;
};

let syncCatch = async () => null;
let sync = async () => null;

const getPosOfLen = (arr, len) => `${len - (arr.length - 1)}`;

const printTryCatch = (isTry, arr, len, msg) => {
  const intPos = getPosOfLen(arr, len);
  const prefix = isTry ? 'Try: ' : 'Catch: ';
  const separator = isTry ? '                                                  ' : '';
  const color = isTry ? 'cyan' : 'cyan';

  print(chalk[color](separator));
  if (isTry) {
    print(chalk[color](`${intPos}: ${msg}`));
  } else {
    // print(chalk[color](`${prefix} (${intPos} of ${len}): ${msg}`));
    print(chalk[color](`CATCH: ${msg}`));
  }
};

const catchMe = async (arrNext, intNextLen, arrCatch, intCatchLen, from) => {
  if (arrCatch && arrCatch.length) {
    const handleCatch = await syncCatch(arrNext, intNextLen, arrCatch, intCatchLen);
    return handleCatch;
  }
  print(chalk.bgRed(' ! Cannot continue ! no more catches'));
  return null;
};

sync = async (arrNext, intNextleng = null) => {
  const intNextLen = intNextleng || arrNext.length;
  const { msg, cmd, func } = arrNext[0];
  const strMsg = msg || cmd || func.name;

  printTryCatch(true, arrNext, intNextLen, strMsg);

  const objCMD = arrNext.shift();
  const arrCatch = objCMD.catch;
  const intCatchLen = (arrCatch && arrCatch.length) || 0;
  await process(objCMD)
    .then(async () => {
      if (arrNext.length) {
        const next = await sync(arrNext, intNextLen);
        return next;
      }
      return null;
    })
    .catch(async () => {
      await catchMe(arrNext, intNextLen, arrCatch, intCatchLen, 'sync');
      if (arrNext && arrNext.length) {
        const next = await sync(arrNext, intNextLen);
        return next;
      }
      return null;
    });
};

syncCatch = async (arrNext, intNextLen, arrCatch, intCatchLen) => {
  const { msg, cmd, func } = arrCatch[0];
  const strMsg = msg || cmd || func.name;
  printTryCatch(false, arrCatch, intCatchLen, strMsg);

  const objCMD = arrCatch.shift();

  await process(objCMD)
    // .then(async () => {
    //   if (arrNext.length) {
    //     // console.log(' £ Catch past. Moving onto next cmd');
    //     const next = await sync(arrNext, intNextLen);
    //     return next;
    //   }
    //   // console.log(' £ Catch past. End of next cmd');
    //   return null;
    // })
    .catch(async () => {
      await catchMe(arrNext, intNextLen, arrCatch, intCatchLen, 'syncCatch');
    });
};

// const createDockerMachine = async () => {
//   print('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
//   print('start scripts - docker - mongo, mongo-express, graphql');

//   await sync([
//     {
//       msg: 'is - docker machine default exists',
//       cmd: `docker-machine active`,
//       catch: [
//         {
//           msg: 'enable - docker shell commands',
//           cmd: `@FOR /f "tokens=*" %i IN ('docker-machine env --shell cmd default') DO @%i`
//         },
//         {
//           msg: 'create - dockar-machine default',
//           cmd: 'docker-machine create -d virtualbox --virtualbox-share-folder "c:\\:/c" default'
//         }
//       ]
//     },
//     {
//       msg: 'enable - docker shell commands',
//       cmd: `@FOR /f "tokens=*" %i IN ('docker-machine env --shell cmd default') DO @%i`
//     }
//   ]);

//   print(`End scripts`);
//   print('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
// };

// spawn(cmd, defaultOptions, defaultHandle(msg, resolve, reject))

const experimentEcho1 = handle => {
  const error = 'mock error experimentEcho1';
  const stdout = 'experimentEcho1';
  const stderr = null;
  setTimeout(() => {
    handle(error, stdout, stderr);
  }, 2000);
};

const experimentEcho2 = handle => {
  const error = 'mock error experimentEcho2';
  const stdout = null;
  const stderr = null;
  handle(error, stdout, stderr);
};

const experimentEcho3 = handle => {
  const error = false;
  const stdout = 'success';
  const stderr = null;
  handle(error, stdout, stderr);
};

const experimentEcho4 = handle => {
  const error = false;
  const stdout = 'success';
  const stderr = null;
  handle(error, stdout, stderr);
};

const experimentEcho5 = handle => {
  const error = 'echo 5 fails';
  const stdout = null;
  const stderr = null;
  handle(error, stdout, stderr);
};

const experimentEcho6 = handle => {
  const error = false;
  const stdout = null;
  const stderr = null;
  handle(error, stdout, stderr);
};

const createDockerMachine = async () => {
  print(chalk.cyan('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^'));
  print(chalk.cyan('start scripts - mock test'));

  await sync([
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

  print(chalk.cyan(`End scripts`));
  print(chalk.cyan('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^'));
};

createDockerMachine().then(() => {
  console.log('finished!');
});

// {
//   cmd: 'docker-machine rm -f default',
//   msg: 'remove docker-machine'
// }
// ####################################################################################
// const argv = process.argv.reduce((acc, cur) => {
//   const vars = cur.split('=');
//   if (vars.length > 1) {
//     acc[vars[0].replace(/^\-\-/, '')] = vars[1];
//   }
//   return acc;
// }, {});

// const spawns = init([
//   () => {
//     createDockerMachine();
//   }
// ]);

// const cmd = (objCMD, fnExit = () => {}) => {
//   const { cmds, newWindow } = objCMD;
//   const cwd = objCMD.cwd || './';
//   console.log(`# Start: cmd ${cmds}`);

//   const spawnItem = newWindow
//     ? exec(cmds, {
//         stdio: 'inherit',
//         shell: true,
//         cwd
//       })
//     : spawn(cmds, {
//         stdio: 'inherit',
//         shell: true,
//         cwd
//       });

//   spawnItem.on('exit', (code, signal) => {
//     console.log(`= End: cmd ${cmds}`);
//     fnExit();
//   });

//   spawnItem.on('error', err => {
//     console.log('! Error: ', err);
//   });
//   return spawnItem;
// };

// const cmdIterate = async (arrSpawnList, fnEnd = () => {}) => {
//   if (arrSpawnList.length) {
//     const objCMD = arrSpawnList.shift();
//     if (typeof objCMD === 'function') {
//       const fnName = objCMD.name;
//       console.log(`# Start: function ${fnName}`);
//       await objCMD();
//       cmdIterate(arrSpawnList, fnEnd);
//       console.log(`- End : function ${fnName}`);
//     } else {
//       return cmd(objCMD, () => cmdIterate(arrSpawnList, fnEnd));
//     }
//   } else {
//     fnEnd();
//   }
// };

// const init = async arrCmds => {
//   const timeStart = new Date().getTime();

//   console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
//   console.log('Start all');

//   const result = await cmdIterate(arrCmds, () => {
//     const timeEnd = new Date().getTime();
//     const mins = (timeEnd - timeStart) / 1000 / 60;

//     console.log(`End all. Completed in ${mins} mins.`);
//     console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
//   });
//   return result;
// };

// const createDockerMachine = async () => {
//   // windows only - create alternative for mac if testing
//   const cmdAsBash = await execPromise(
//     `@FOR /f "tokens=*" %i IN ('docker-machine env --shell cmd default') DO @%i`
//   );
//   const dockerRunning = await execPromise(`docker-machine status`);
//   if (dockerRunning !== 'Running') {

//   }
//   cmd({
//     cmds: `docker-machine create -d virtualbox --virtualbox-share-folder "c:\\:/c" default`,
//     newwindow: true
//   });
// };
// const spawns = init([
//   () => {
//     createDockerMachine();
//   }
// ]);

// equivalent to single command line...
// cwd changes directory to which the command is applied.
// const spawnCRA = cmd({cmds: `npx create-react-app ${argv.name}`, cwd: '../'});
// spawnCRA.kill('SIGKILL');
