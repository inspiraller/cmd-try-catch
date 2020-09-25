
import promiseExec, { handleExecOut } from 'src/promiseExec';

type IObjSuccessOrError = {
  success?: IObjSuccess['success'];
  error?: IObjError['error'];
} | void;

describe('promiseExec - all', () => {
  describe('promiseExec', () => {
    it('should return promise {success: value}', async () => {
      const response: IObjSuccessOrError = await promiseExec('echo steve');
      expect(response.success).toBeDefined();
      expect(response.success).toMatch(/steve/);
      expect(response.error).not.toBeDefined();
    });
    it('should return promise {error: value}', async () => {
      const response: IObjSuccessOrError = await promiseExec('cmdThatDoesntExist arg').catch(err => {
        expect(err).toBeDefined();
      });
      expect(response && response.success).not.toBeDefined();
    });
  });

  describe('handleExecOut', () => {
    it('should return {success: value}', async () => {
      const response: IObjSuccessOrError = await new Promise((resolve: TResolveFunc, reject) => {
        handleExecOut(resolve, reject)(null, '', 'success');
      });
      expect(response.success).toBeDefined();
      expect(response.success).toMatch(/success/);
      expect(response.error).not.toBeDefined();
    });
    it('should return {error: value}', async () => {
      const response: IObjSuccessOrError = await new Promise((resolve: TResolveFunc, reject) => {
        handleExecOut(resolve, reject)(Error('some error'), '', '');
      }).catch(err => {
        expect(err).toBeDefined();
      });
      expect(response).not.toBeDefined();
    });
  });
});
