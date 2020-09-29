# cmd-try-catch description
This repository enables the ability to provide an array of commands with catch alternatives

# Instructions
- You supply an array of commands which run either asynchronously or synchronously
- Each command waits until the other has completed
- You can supply either a cmd or a function or a promise
- The function and promise must return an object of either {success: 'some string'}, or {error: Error('some error')}
- You can also provide an additional - catch, property, so if that command fails then the catch array runs in the same manner.
- if a catch command fails, then the next on in the catch list is tried, until one catch command succeeds and then this moves onto the next command in the parent list.
- if there are no more catch commands then the final isComplete message will be false.

# Example of an array of commands
```typescript
const isComplete = await sync([
  {
    cmd: 'echo success1', // if this command is successful, and doesn't return an error then the next item in the array will run.
  },
  {
    func: exampleFunctionSuccess // this must return either a promise resolving to {success: 'something'} or a function result of the same, in order for the next command to run
  },
  {
    cmd: 'echo success2'
  },
  {
    cmd: 'docker run etc...' // if the final command is succesful then the variable - isComplete === true otherwise its === false
  }
]);
```
# Example of an array of commands with catch alternatives 
```typescript
import sync, {TFunc} from 'cmd-try-catch';

const exampleFunctionError: TFunc = () => new Promise((resolve, reject => {
  // my code here...
  reject({
    error: Error('custom error')
  });
}));

const exampleFunctionSuccess: TFunc = () => new Promise((resolve, reject => {
  // my code here...
  resolve({
    error: Error('custom error')
  });
}));

const isComplete = await sync([
  {
    cmd: 'some error1', // if error - go to - child catch 1
    catch: [
      {
        cmd: 'some error2' // if error - go to - child catch 2
      },
      {
        cmd: 'echo success1' // if success - go to - next parent
      }
    ]
  },
  {
    func: exampleFunctionError, // if error - go to - child catch 1
    catch: [
      {
        cmd: 'echo success' // if success - go to - next parent
      }
    ]
  },
  {
    func: exampleFunctionSuccess // if success - isComplete === true
  }
]);
```
# Test example

```typescript
import { ISyncReturn } from 'src/types';
import sync from 'src/sync';
import stripMap from './utils/stripMap';
let objReturn: ISyncReturn;

describe('my map of commands', () => {
  beforeAll(async () => {
    objReturn = await sync([
      {
        cmd: 'some error1',
        catch: [
          {
            cmd: 'echo success'
          }
        ]
      },
      {
        cmd: 'some error2'
      }
    ]);
  });
  it('should not complete', () => {
    expect(objReturn.isComplete).toBe(false); // all commands have not completed because one failed.
  });
  it('map response should match', () => { // This is an example of a map of those commands that failed and those that passed.
    expect(stripMap(objReturn.map)).toMatchObject([{
      complete: false, // 1 fail - try the command in the catch method.
      catch: [{
        complete: true // 2 success - now go back to the parent and try the next command
      }]
    }, {
      complete: false // 3 fail - no more catch commands exist so - isComplete === false
    }]);
  });
});
```