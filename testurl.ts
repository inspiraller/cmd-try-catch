import { IObjSuccessOrError } from 'src/types';
import urlExistPromise from '__tests__/utils/urlExistPromise';

const init = async () => {
  const exist: IObjSuccessOrError | void = await urlExistPromise('http://localhost/tutorial').catch(err => {
    console.log('err = ', err);
  });
  console.log('exist =', exist);
}

init();