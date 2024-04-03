import getMockedClient, {
  AuthClientMock,
  registerSessionOutput,
} from '@mocks/lib/auth';
jest.mock('@lib/auth', () => getMockedClient);

import express from 'express';
import request from 'supertest';
import { endRegister } from '../../../src/controllers/auth/endRegister';
import { expectResolved, validStaffEntry } from '../../utils';

const validPayload = {
  id: validStaffEntry.id,
  EACRegisterToken: 'token',
};

describe('End Register Endpoint', () => {
  const app = express();

  beforeAll(() => {
    app.use(express.json({ type: 'application/json' }));
    app.post('/', endRegister);
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
        .send({ EACRegisterToken: validPayload.EACRegisterToken }),
    ]);
    responses.forEach((response) => {
      expect(response.badRequest);
    });
  });

  it('should reject with 500 if anything throws', async () => {
    getMockedClient.mockImplementationOnce(() => {
      throw new Error('Intentional get auth client error');
    });
    AuthClientMock.registerSetupSession.mockImplementationOnce(() => {
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
    AuthClientMock.registerSetupSession.mockResolvedValueOnce({
      success: false,
    });
    const response = await request(app).post('/').send(validPayload);
    expect(getMockedClient).toHaveBeenCalled();
    expect(getMockedClient).toHaveReturnedWith(AuthClientMock);
    expect(AuthClientMock.registerSetupSession).toHaveBeenCalledWith({
      userId: String(validPayload.id),
      EACRegisterToken: validPayload.EACRegisterToken,
    });
    expectResolved(AuthClientMock.registerSetupSession).toMatchObject({
      success: false,
    });
    expect(response.badRequest);
  });

  test('Best case scenario', async () => {
    const response = await request(app).post('/').send(validPayload);
    expect(getMockedClient).toHaveBeenCalled();
    expect(getMockedClient).toHaveReturnedWith(AuthClientMock);
    expect(AuthClientMock.registerSetupSession).toHaveBeenCalledWith({
      userId: String(validPayload.id),
      EACRegisterToken: validPayload.EACRegisterToken,
    });
    expectResolved(AuthClientMock.registerSetupSession).toMatchObject(
      registerSessionOutput
    );
    expect(response.ok);
    expect(response.body).toMatchObject(registerSessionOutput);
  });
});
