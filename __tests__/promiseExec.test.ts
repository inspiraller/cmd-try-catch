
import { IObjSuccessOrError, TResolveFunc} from 'src/sync';
import promiseExec, { handleExecOut } from 'src/promiseExec';

type IObjSuccessOrErrorVoid = IObjSuccessOrError | void;

describe('promiseExec - all', () => {
  describe('promiseExec', () => {
    it('should return promise {success: value}', async () => {
      const response: IObjSuccessOrErrorVoid = await promiseExec({cmd: 'echo steve'});
      expect(response.success).toBeDefined();
      expect(response.success).toMatch(/steve/);
      expect(response.error).not.toBeDefined();
    });
    it('should return promise {error: value}', async () => {
      const response: IObjSuccessOrErrorVoid = await promiseExec({cmd: 'cmdThatDoesntExist arg'}).catch(err => {
        expect(err).toBeDefined();
      });
      expect(response && response.success).not.toBeDefined();
    });
  });

  describe('handleExecOut', () => {
    it('should return {success: value}', async () => {
      const response: IObjSuccessOrErrorVoid = await new Promise((resolve: TResolveFunc, reject) => {
        handleExecOut({cmd: 'echo success'}, resolve, reject)(null, '', 'success');
      });
      expect(response.success).toBeDefined();
      expect(response.success).toMatch(/success/);
      expect(response.error).not.toBeDefined();
    });
    it('should return {error: value}', async () => {
      const response: IObjSuccessOrErrorVoid = await new Promise((resolve: TResolveFunc, reject) => {
        handleExecOut({cmd: 'echo error'}, resolve, reject)(Error('some error'), '', '');
      }).catch(err => {
        expect(err).toBeDefined();
      });
      expect(response).not.toBeDefined();
    });
  });
});
