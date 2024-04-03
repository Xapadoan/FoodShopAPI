import getMockedClient, {
  AuthClientMock,
  iniRegisterOutput,
} from '@mocks/lib/auth';
jest.mock('@lib/auth', () => getMockedClient);

import express from 'express';
import request from 'supertest';
import { initRegister } from '../../../src/controllers/auth/initRegister';
import { StaffsRepository } from '@repo/StaffsRepository';
import { expectResolved, validStaff, validStaffEntry } from '../../utils';

const readStaffSpy = jest
  .spyOn(StaffsRepository.prototype, 'read')
  .mockResolvedValue(undefined);
const createStaffSpy = jest
  .spyOn(StaffsRepository.prototype, 'create')
  .mockResolvedValue(validStaffEntry);
const validateStaffSpy = jest
  .spyOn(StaffsRepository.prototype, 'validate')
  .mockReturnValue(true);

describe('Init Register Endpoint', () => {
  const app = express();

  beforeAll(() => {
    app.use(express.json({ type: 'application/json' }));
    app.post('/', initRegister);
  });
  afterAll(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should reject invalid payloads with 400', async () => {
    validateStaffSpy.mockReturnValue(false);
    const responses = await Promise.all([
      request(app).post('/').send('Hello !'),
      request(app).post('/').send({ name: validStaff.name }),
      request(app).post('/').send({ email: validStaff.email }),
    ]);
    expect(validateStaffSpy).toHaveBeenCalledTimes(responses.length);
    expect(validateStaffSpy).not.toHaveReturnedWith(true);
    responses.forEach((response) => {
      expect(response.badRequest);
    });
    validateStaffSpy.mockReturnValue(true);
  });

  it('should reject with 429 when user already exists', async () => {
    readStaffSpy.mockResolvedValueOnce(validStaffEntry);
    const response = await request(app).post('/').send(validStaff);
    expect(validateStaffSpy).toHaveBeenCalled();
    expect(validateStaffSpy).toHaveReturnedWith(true);
    expect(readStaffSpy).toHaveBeenCalledWith({ email: validStaff.email });
    expectResolved(readStaffSpy).toMatchObject(validStaffEntry);
    expect(response.statusCode).toEqual(429);
  });

  it('should reject with 500 if anything throws', async () => {
    readStaffSpy.mockImplementationOnce(() => {
      throw new Error('Intentional read staff error');
    });
    getMockedClient.mockImplementationOnce(() => {
      throw new Error('Intentional get auth client error');
    });
    createStaffSpy.mockImplementationOnce(() => {
      throw new Error('Intentional create staff error');
    });
    AuthClientMock.initRegister.mockResolvedValueOnce(null);
    const responses = await Promise.all([
      request(app).post('/').send(validStaff),
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
    expect(validateStaffSpy).toHaveBeenCalled();
    expect(validateStaffSpy).toHaveReturnedWith(true);
    expect(readStaffSpy).toHaveBeenCalledWith({ email: validStaff.email });
    expectResolved(readStaffSpy).toBeUndefined();
    expect(createStaffSpy).toHaveBeenCalledWith(validStaff);
    expectResolved(createStaffSpy).toMatchObject(validStaffEntry);
    expect(AuthClientMock.initRegister).toHaveBeenCalledWith({
      email: validStaff.email,
    });
    expectResolved(AuthClientMock.initRegister).toMatchObject(
      iniRegisterOutput
    );
    expect(response.statusCode).toEqual(201);
    expect(response.body).toMatchObject({
      ...validStaffEntry,
      ...iniRegisterOutput,
    });
  });
});
