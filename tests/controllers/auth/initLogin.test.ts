import getMockedClient, {
  AuthClientMock,
  initRestoreOutput,
} from '@mocks/lib/auth';
jest.mock('@lib/auth', () => getMockedClient);

import express from 'express';
import request from 'supertest';
import { initLogin } from '../../../src/controllers/auth/initLogin';
import { StaffsRepository } from '@repo/StaffsRepository';
import { expectResolved, validStaff, validStaffEntry } from '../../utils';

const readStaffSpy = jest
  .spyOn(StaffsRepository.prototype, 'read')
  .mockResolvedValue(validStaffEntry);

describe('Init Login Endpoint', () => {
  const app = express();

  beforeAll(() => {
    app.use(express.json({ type: 'application/json' }));
    app.post('/', initLogin);
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
    ]);
    responses.forEach((response) => {
      expect(response.badRequest);
    });
  });

  it('should reject with 404 when user does not exists', async () => {
    readStaffSpy.mockResolvedValueOnce(undefined);
    const response = await request(app).post('/').send(validStaff);
    expect(readStaffSpy).toHaveBeenCalledWith({ email: validStaff.email });
    expectResolved(readStaffSpy).toBeUndefined();
    expect(response.statusCode).toEqual(404);
  });

  it('should reject with 500 if anything throws', async () => {
    readStaffSpy.mockImplementationOnce(() => {
      throw new Error('Intentional read staff error');
    });
    getMockedClient.mockImplementationOnce(() => {
      throw new Error('Intentional get auth client error');
    });
    AuthClientMock.initRestore.mockResolvedValueOnce(null);
    const responses = await Promise.all([
      request(app).post('/').send(validStaff),
      request(app).post('/').send(validStaff),
      request(app).post('/').send(validStaff),
    ]);
    responses.forEach((response) => {
      expect(response.serverError);
    });
  });

  test('Best case scenario', async () => {
    const response = await request(app).post('/').send(validStaff);
    expect(readStaffSpy).toHaveBeenCalledWith({ email: validStaff.email });
    expectResolved(readStaffSpy).toMatchObject(validStaffEntry);
    expect(getMockedClient).toHaveBeenCalled();
    expect(getMockedClient).toHaveReturnedWith(AuthClientMock);
    expect(AuthClientMock.initRestore).toHaveBeenCalledWith({
      email: validStaff.email,
    });
    expectResolved(AuthClientMock.initRestore).toMatchObject(initRestoreOutput);
    expect(response.ok);
    expect(response.body).toMatchObject({
      id: validStaffEntry.id,
      ...initRestoreOutput,
    });
  });
});
