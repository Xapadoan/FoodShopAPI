import getMockedClient, {
  AuthClientMock,
  onResetConfirmOutput,
} from '@mocks/lib/auth';
jest.mock('@lib/auth', () => getMockedClient);

import express from 'express';
import request from 'supertest';
import { onResetConfirm } from '../../../src/controllers/auth/webhook/resetConfirm';
import { expectResolved } from '../../utils';

describe('Reset Confirm Webhook Endpoint', () => {
  const app = express();

  beforeAll(() => {
    app.use(express.json({ type: 'application/json' }));
    app.post('/', onResetConfirm);
  });
  afterAll(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should reject with 500 if anything throws', async () => {
    getMockedClient.mockImplementationOnce(() => {
      throw new Error('Intentional get auth client error');
    });
    AuthClientMock.onResetConfirm.mockImplementationOnce(() => {
      throw new Error('Intentional onRegisterUpload error');
    });
    const responses = await Promise.all([
      request(app).post('/').send({ fake: 'data' }),
      request(app).post('/').send({ fake: 'data' }),
    ]);
    responses.forEach((response) => {
      expect(response.serverError);
    });
  });

  test('Best case scenario', async () => {
    const response = await request(app).post('/').send({ fake: 'data' });
    expect(getMockedClient).toHaveBeenCalled();
    expect(getMockedClient).toHaveReturnedWith(AuthClientMock);
    expect(AuthClientMock.onResetConfirm).toHaveBeenCalled();
    expectResolved(AuthClientMock.onResetConfirm).toEqual(onResetConfirmOutput);
    expect(response.ok);
    expect(response.body).toMatchObject({
      EACResetToken: onResetConfirmOutput,
    });
  });
});
