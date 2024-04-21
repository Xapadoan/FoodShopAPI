import getMockedClient, {
  AuthClientMock,
  readSessionOutput,
} from '@mocks/lib/auth';
jest.mock('@lib/auth', () => getMockedClient);

import express, { Request, Response, Application } from 'express';
import request from 'supertest';
import {
  expectRejected,
  expectResolved,
  routeMock,
  validStaffEntry,
} from '../../utils';
import '../../../src/moduleAugmentations/express';
import { staffAuthMiddleware } from '@controllers/middlewares/auth';
import { Staff, StaffsRepository } from '@repo/StaffsRepository';
import { Entry } from '@repo/Repository';

describe('Staff auth middleware', () => {
  let app: Application;
  let readStaffSpy: jest.SpyInstance<
    Promise<Entry<Staff> | undefined>,
    [Partial<Entry<Staff>>]
  >;
  let route: jest.Mock<Response, [Request, Response]>;
  beforeAll(() => {
    app = express();
    readStaffSpy = jest
      .spyOn(StaffsRepository.prototype, 'read')
      .mockResolvedValue(validStaffEntry);
    route = jest.fn(routeMock);
    app.use(staffAuthMiddleware);
    app.get('/', route);
  });
  afterAll(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 when auth header is not valid', async () => {
    const responses = await Promise.all([
      request(app).get('/'),
      request(app).get('/').set({ authorization: 'asddsa' }),
      request(app).get('/').set({ authorization: 'asd asd' }),
      request(app).get('/').set({ authorization: 'Bearer' }),
    ]);
    expect(AuthClientMock.readSession).not.toHaveBeenCalled();
    expect(readStaffSpy).not.toHaveBeenCalled();
    expect(route).not.toHaveBeenCalled();
    responses.forEach((response) => {
      expect(response.status).toEqual(401);
    });
  });

  it('should return 401 when session is not found', async () => {
    AuthClientMock.readSession.mockResolvedValueOnce(null);
    const response = await request(app)
      .get('/')
      .set({ authorization: 'Bearer session-id' });
    expect(AuthClientMock.readSession).toHaveBeenCalledWith('session-id');
    expectResolved(AuthClientMock.readSession).toBeNull();
    expect(readStaffSpy).not.toHaveBeenCalled();
    expect(route).not.toHaveBeenCalled();
    expect(response.status).toEqual(401);
  });

  it('should return 401 when user is not found', async () => {
    readStaffSpy.mockResolvedValueOnce(undefined);
    const response = await request(app)
      .get('/')
      .set({ authorization: 'Bearer session-id' });
    expect(AuthClientMock.readSession).toHaveBeenCalledWith('session-id');
    expectResolved(AuthClientMock.readSession).toEqual(readSessionOutput);
    expect(readStaffSpy).toHaveBeenCalledWith({
      id: Number(readSessionOutput),
    });
    expectResolved(readStaffSpy).toBeUndefined();
    expect(route).not.toHaveBeenCalled();
    expect(response.status).toEqual(401);
  });

  it('should return 500 if anything throws', async () => {
    AuthClientMock.readSession.mockImplementationOnce(async () => {
      throw new Error('Intentional readSession error');
    });
    readStaffSpy.mockImplementationOnce(async () => {
      throw new Error('Intentional readStaff error');
    });
    const responses = await Promise.all([
      request(app).get('/').set({ authorization: 'Bearer session-id' }),
      request(app).get('/').set({ authorization: 'Bearer session-id' }),
    ]);

    expectRejected(AuthClientMock.readSession);
    expectRejected(readStaffSpy);
    responses.forEach((response) => {
      expect(response.status).toEqual(500);
    });
  });

  test('best case scenario', async () => {
    await request(app).get('/').set({ authorization: 'Bearer session-id ' });
    expect(AuthClientMock.readSession).toHaveBeenCalledWith('session-id');
    expectResolved(AuthClientMock.readSession).toEqual(readSessionOutput);
    expect(readStaffSpy).toHaveBeenCalledWith({
      id: Number(readSessionOutput),
    });
    expectResolved(readStaffSpy).toMatchObject(validStaffEntry);
    expect(route).toHaveBeenCalled();

    const req = route.mock.calls[0][0];
    expect(req.staff).toMatchObject(validStaffEntry);
  });
});
