# This repository enables the ability to provide an array of commands with catch alternatives
# Example

```typescript
import sync, {TProcessResponseFunc} from 'cmd-try-catch';

const doRun = (handle: TProcessResponseFunc) => {
  const error = Error('run failed');
  const stdout = 'success';
  const stderr = '';
  handle(error, stdout, stderr);
};

const doWalk = (handle: TProcessResponseFunc) => {
  const error = null;
  const stdout = 'success';
  const stderr = '';
  handle(error, stdout, stderr);
}

const isComplete = await sync([
  {
    cmd: 'echo x',
    catch: [
      {
        msg: 'echo x failed so do this instead',
        cmd: 'echo y'
      },
      {
        msg: 'echo y failed so do this instead',
        cmd: 'echo "y"'
      }
    ]
  },
  {
    func: doRun,
    catch: [
      {
        func: doWalk
      }
    ]
  }
]);
```

# You supply a list of commands in an array like this:
```typescript
const isComplete = await sync([
  {
    cmd: 'echo x',
  },
  {
    func: doRun
  },
  {
    cmd: doWalk
  },
  {
    cmd: 'docker run etc...'
  }
]);
```

# In the case of the steps above something may fail you supply an array of catch alternatives
```typescript
const isComplete = await sync([
  {
    cmd: 'echo x',
    catch: [
        {
          func: doRun
        },
        {
          func: doWalk
        },   
    ]
  },
  {
    func: doRun
  },
  {
    cmd: doWalk
  },
  {
    cmd: 'docker run etc...'
  }
]);
```

# You can supply cmd, or functions.
The beauty of this approach is its self evident of expected steps.
