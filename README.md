# cmd-try-catch description
This repository enables the ability to provide an array of commands with catch alternatives

# The reason for this library
- I want to supply an array of commands that run in sequence, one after the other. 
- If one of those commands fail then I want to try a series of catch commands.
- If the a catch command fails, then the next catch command is tried and so on.
- If a catch command succeeds, then move onto the next try command in the top array.

**example:**
```typescript
import sync, {stripMap} from 'sync';

const objResult = sync([{
  cmd: 'command1Try',
  catch: [{
     // command1Try failed so try this - command1Catch1 
    cmd: 'command1Catch1'
  }, {
    // command1Catch1 failed so catch this - command1Catch2 
    cmd: 'command1Catch2'
  }, {
     // command1Catch2 failed so catch this - echo catchSuccess
    cmd: 'echo catchSuccess'
  }, {
     // Never gets here because the previous command succeeded.
    cmd: 'neverGetsToThisCatchCommand'
  }]
}, {
  // echo catchSuccess succeeded so try this - echo success
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
      complete: null
    }],
  },
  {
    complete: false // 3 fail - no more catch commands exist so - isComplete === false
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

## example with cmd, func and promise
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
  }, {
    cmd: 'neverGetsToThisCatchCommand', // Never gets here because the previous command succeeded.
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
          func: getUrlDockerTutorial,
          catch: [{
            cmd: `docker run -d -p 80:80 --name ${id} docker/getting-started`
          }]
        }, {
          func: getUrlDockerTutorial
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
