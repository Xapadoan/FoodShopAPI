import { routeMock } from '../../utils';

const webhookRouterMock = jest.fn().mockImplementation(routeMock);
jest.mock('@controllers/auth/webhook', () => webhookRouterMock);
const endLoginRouteMock = jest.fn().mockImplementation(routeMock);
jest.mock('@controllers/auth/endLogin', () => ({
  endLogin: endLoginRouteMock,
}));
const endRegisterRouteMock = jest.fn().mockImplementation(routeMock);
jest.mock('@controllers/auth/endRegister', () => ({
  endRegister: endRegisterRouteMock,
}));
const endResetRouteMock = jest.fn().mockImplementation(routeMock);
jest.mock('@controllers/auth/endReset', () => ({
  endReset: endResetRouteMock,
}));
const initLoginRouteMock = jest.fn().mockImplementation(routeMock);
jest.mock('@controllers/auth/initLogin', () => ({
  initLogin: initLoginRouteMock,
}));
const initRegisterRouteMock = jest.fn().mockImplementation(routeMock);
jest.mock('@controllers/auth/initRegister', () => ({
  initRegister: initRegisterRouteMock,
}));
const initResetRouteMock = jest.fn().mockImplementation(routeMock);
jest.mock('@controllers/auth/initReset', () => ({
  initReset: initResetRouteMock,
}));
const logoutRouteMock = jest.fn().mockImplementation(routeMock);
jest.mock('@controllers/auth/logout', () => ({ logout: logoutRouteMock }));

import request from 'supertest';
import express, { Application } from 'express';
import authRouter from '@controllers/auth';

describe('Auth router', () => {
  let app: Application;
  beforeAll(() => {
    app = express();
    app.use(authRouter);
  });
  afterAll(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should use init register on [POST] /register/init', async () => {
    await request(app).post('/register/init');
    expect(initRegisterRouteMock).toHaveBeenCalled();
  });

  it('should use end register on [POST] /register/end', async () => {
    await request(app).post('/register/end');
    expect(endRegisterRouteMock).toHaveBeenCalled();
  });

  it('should use init login on [POST] /login/init', async () => {
    await request(app).post('/login/init');
    expect(initLoginRouteMock).toHaveBeenCalled();
  });

  it('should use end login on [POST] /login/end', async () => {
    await request(app).post('/login/end');
    expect(endLoginRouteMock).toHaveBeenCalled();
  });

  it('should use init reset on [POST] /reset/init', async () => {
    await request(app).post('/reset/init');
    expect(initResetRouteMock).toHaveBeenCalled();
  });

  it('should use end reset on [POST] /reset/end', async () => {
    await request(app).post('/reset/end');
    expect(endResetRouteMock).toHaveBeenCalled();
  });

  it('should use logout on [DELETE] /logout', async () => {
    await request(app).del('/logout');
    expect(logoutRouteMock).toHaveBeenCalled();
  });

  it('should use the webhook router on [ALL] /webhook', async () => {
    await Promise.all([
      request(app).get('/webhook'),
      request(app).post('/webhook'),
      request(app).put('/webhook'),
      request(app).del('/webhook'),
      request(app).patch('/webhook'),
    ]);
    expect(webhookRouterMock).toHaveBeenCalledTimes(5);
  });
});
