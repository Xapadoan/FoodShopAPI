import { routeMock } from '../../utils';

const meMock = jest.fn().mockImplementation(routeMock);
jest.mock('@controllers/staffs/me', () => ({ me: meMock }));
const shopsRouterMock = jest.fn().mockImplementation(routeMock);
jest.mock('@controllers/staffs/shops', () => shopsRouterMock);

import { staffAuthMiddlewareMock } from '@mocks/middlewares/auth';
jest.mock('@controllers/middlewares/auth', () => ({
  staffAuthMiddleware: staffAuthMiddlewareMock,
}));

import request from 'supertest';
import express, { Application } from 'express';
import staffsRouter from '@controllers/staffs';

describe('Staffs router', () => {
  let app: Application;
  beforeAll(() => {
    app = express();
    app.use(staffsRouter);
  });
  afterAll(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should use me on [GET] /me', async () => {
    await request(app).get('/me');
    expect(meMock).toHaveBeenCalled();
    expect(staffAuthMiddlewareMock).toHaveBeenCalled();
  });

  it('should use shops router on [ALL] /shops', async () => {
    await Promise.all([
      request(app).get('/shops'),
      request(app).post('/shops'),
      request(app).put('/shops'),
      request(app).del('/shops'),
      request(app).patch('/shops'),
    ]);
    expect(shopsRouterMock).toHaveBeenCalledTimes(5);
    expect(staffAuthMiddlewareMock).toHaveBeenCalledTimes(5);
  });
});
