# cmd-try-catch description
This repository enables the ability to provide an array of commands with catch alternatives

# The reason for this library
- I want to supply an array of commands that run in sequence, one after the other. 
- If one of those commands fail then I want to try a series of catch commands.
- If the catch command fails, then move onto the next catch command. If that catch command succeeds then retry the original command.
- If the original command passes, then move onto the next top command, otherwise stop the entire sequence.
- If the original command fails again, then try any remaining untried catch commands. If there are no more catch commands, then stop the sequence.
- If all commands in the top list pass then return a success response.

**example:**
```typescript
import sync, {stripMap} from 'sync';

const objResult = sync([{
  // 1 try command1Try, 5 try again
  cmd: 'command1Try', 
  catch: [{
     // 2 commandTry1 fails so try this
    cmd: 'command1Catch1'
  }, {
    // 3 command1Catch1 fails so try this
    cmd: 'command1Catch2'
  }, {
     // 4 command1Catch2 fails so try this
    cmd: 'echo catchSuccess' // This succeeds so retry command1Try. 
  }, {
     // 6 command1Try fails so try this
    cmd: 'another error'
  }, 
   // 7 no more catch commands to try, so end sequence
  ]
}, {
  // Doesn't reach here because command1Try has failed and there are no catches for it.
  cmd: 'echo success'
}]);

const isAllPass = objResult.isComplete;

const getMapOfPasses = stripMap(objResult.map) 
/*
getMapOfPasses = [
  {
    complete: false, 
    catch: [{
      complete: false 
    }, {
      complete: false 
    }, {
      complete: true
    }, {
      complete: false
    }],
  },
  {
    complete: null
  }
];
*/
```

# You can supply either a cmd, function or promise - as long as they all return an objectSuccessOrError
## as success
```typescript
import {IObjSuccessOrError} from 'sync';
const objSuccessOrError: IObjSuccessOrError = {
  success: 'some message string'
}
```
## as error
```typescript
import {IObjSuccessOrError} from 'sync';
objSuccessOrError: IObjSuccessOrError  = {
  error: Error('some error')
}
```

## example with func and promise
```typescript
import sync, { TFunc } from 'cmd-try-catch';

const funcPromiseError: TFunc = () => new Promise((resolve, reject => {
  reject({
    error: Error('custom error')
  });
}));

const funcPromiseSuccess: TFunc = () => new Promise((resolve, reject => {
  resolve({
    success: 'some message'
  });
}));

const funcError: TFunc = () => ({
  error: Error('custom error')
});

const funcSuccess: TFunc = () => ({
  success: 'some message'
});


const objResult = sync([{
  cmd: 'command1Try',
  catch: [{
    func: funcError,
  }, {
    func: funcPromiseError, 
  }, {
    func: funcPromiseSuccess,
  }]
}, {
  func: funcSuccess
}]);
```
# Real world usecase
The real benefit of this is usecases with something like docker, sql, bash scripts etc...

## example usecase
```typescript
import { v4 as uuidv4 } from 'uuid';
import {exec} from 'child_process';
import urlExist from 'url-exist';

import { ISyncReturn , TFunc, TPromiseResponse } from 'src/types';
import sync from 'src/sync';


type TUrlExistPromise = (url: string) => TPromiseResponse;
const urlExistPromise: TUrlExistPromise = async url =>
  await new Promise (async (resolve, reject) => {
    const exist: boolean = await urlExist(url);
    if (exist) {
      resolve({
        success:  url
      });
    } else {
      reject({
        error: Error(`does not exist -${url}`)
      })
    }
  });


let objReturn: ISyncReturn;
const getUrlDockerTutorial: TFunc = async () => await urlExistPromise('http://localhost/tutorial');

let id: string = uuidv4();
describe('sync - usecase', () => {
  describe('Test if docker tutorial is running in localhost. Otherwise catch and run docker getting started, then retest', () => {
    beforeAll(async () => {
      objReturn = await sync([
        {
          func: getUrlDockerTutorial, // 1 first try fails, 3 second try passes
          catch: [{
            cmd: `docker run -d -p 80:80 --name ${id} docker/getting-started` // 2 run docker, now retry first command
          }]
        }
      ]);
    });
    afterAll(async () => {
      await exec(`docker stop ${id}`);
      await exec(`docker rm ${id}`);
    })
    it('should complete', () => {
      expect(objReturn.isComplete).toBe(true);
    });
  });
});
```
