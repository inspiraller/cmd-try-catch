
import promiseExec from 'src/promiseExec';

type TObjSuccessOrError = {
  success?: TObjSuccess['success'];
  error?: TObjError['error'];
} | void;

describe('promiseExec', () => {
  it('should return promise {success: value}', async () => {
    const response: TObjSuccessOrError = await promiseExec('echo steve');
    expect(response.success).toBeDefined();
    expect(response.success).toMatch(/steve/);
    expect(response.error).not.toBeDefined();
  });
  it('should return promise {error: value}', async () => {
    const response: TObjSuccessOrError = await promiseExec('cmdThatDoesntExist arg').catch(err => {
      expect(err).toBeDefined();
    });
    expect(response && response.success).not.toBeDefined();
  });
});
