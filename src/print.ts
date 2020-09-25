import chalk, { Color } from 'chalk';

/* istanbul ignore next */
const print = (msg: string, color?: typeof Color) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(color ? chalk[color](msg) : msg);
  }
};

export default print;