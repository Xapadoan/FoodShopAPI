import getMockedClient, {
  AuthClientMock,
  resetSessionOutput,
} from '@mocks/lib/auth';
jest.mock('@lib/auth', () => getMockedClient);

import express from 'express';
import request from 'supertest';
import { endReset } from '../../../src/controllers/auth/endReset';
import { expectResolved, validStaffEntry } from '../../utils';

const validPayload = {
  id: validStaffEntry.id,
  EACResetToken: 'token',
};

describe('End Reset Endpoint', () => {
  const app = express();

  beforeAll(() => {
    app.use(express.json({ type: 'application/json' }));
    app.post('/', endReset);
  });
  afterAll(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should reject invalid payloads with 400', async () => {
    const responses = await Promise.all([
      request(app).post('/').send('Hello !'),
      request(app).post('/').send({ id: validPayload.id }),
      request(app)
        .post('/')
        .send({ EACResetToken: validPayload.EACResetToken }),
    ]);
    responses.forEach((response) => {
      expect(response.badRequest);
    });
  });

  it('should reject with 500 if anything throws', async () => {
    getMockedClient.mockImplementationOnce(() => {
      throw new Error('Intentional get auth client error');
    });
    AuthClientMock.resetSetupSession.mockImplementationOnce(() => {
      throw new Error('Intentional register session error');
    });
    const responses = await Promise.all([
      request(app).post('/').send(validPayload),
      request(app).post('/').send(validPayload),
    ]);
    responses.forEach((response) => {
      expect(response.serverError);
    });
  });

  it('should reject with 400 if registerSession fails', async () => {
    AuthClientMock.resetSetupSession.mockResolvedValueOnce({
      success: false,
    });
    const response = await request(app).post('/').send(validPayload);
    expect(getMockedClient).toHaveBeenCalled();
    expect(getMockedClient).toHaveReturnedWith(AuthClientMock);
    expect(AuthClientMock.resetSetupSession).toHaveBeenCalledWith({
      userId: String(validPayload.id),
      EACResetToken: validPayload.EACResetToken,
    });
    expectResolved(AuthClientMock.resetSetupSession).toMatchObject({
      success: false,
    });
    expect(response.badRequest);
  });

  test('Best case scenario', async () => {
    const response = await request(app).post('/').send(validPayload);
    expect(getMockedClient).toHaveBeenCalled();
    expect(getMockedClient).toHaveReturnedWith(AuthClientMock);
    expect(AuthClientMock.resetSetupSession).toHaveBeenCalledWith({
      userId: String(validPayload.id),
      EACResetToken: validPayload.EACResetToken,
    });
    expectResolved(AuthClientMock.resetSetupSession).toMatchObject(
      resetSessionOutput
    );
    expect(response.ok);
    expect(response.body).toMatchObject(resetSessionOutput);
  });
});
