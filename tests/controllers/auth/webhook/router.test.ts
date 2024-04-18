import { routeMock } from '../../../utils';

const onRegisterMock = jest.fn().mockImplementation(routeMock);
jest.mock('@controllers/auth/webhook/register', () => ({
  onRegister: onRegisterMock,
}));
const onLoginMock = jest.fn().mockImplementation(routeMock);
jest.mock('@controllers/auth/webhook/login', () => ({ onLogin: onLoginMock }));
const onResetConfirmMock = jest.fn().mockImplementation(routeMock);
jest.mock('@controllers/auth/webhook/resetConfirm', () => ({
  onResetConfirm: onResetConfirmMock,
}));
const onResetUploadMock = jest.fn().mockImplementation(routeMock);
jest.mock('@controllers/auth/webhook/resetUpload', () => ({
  onResetUpload: onResetUploadMock,
}));

import request from 'supertest';
import express, { Application } from 'express';
import authWebhookRouter from '@controllers/auth/webhook';

describe('Auth webhook router', () => {
  let app: Application;
  beforeAll(() => {
    app = express();
    app.use(authWebhookRouter);
  });
  afterAll(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should use onRegister on [POST] /register', async () => {
    await request(app).post('/register');
    expect(onRegisterMock).toHaveBeenCalled();
  });

  it('should use onLogin on [POST] /register', async () => {
    await request(app).post('/login');
    expect(onLoginMock).toHaveBeenCalled();
  });

  it('should use onResetConfirm on [POST] /reset-confirm', async () => {
    await request(app).post('/reset-confirm');
    expect(onResetConfirmMock).toHaveBeenCalled();
  });

  it('should use onResetUpload on [POST] /reset-credentials', async () => {
    await request(app).post('/reset-credentials');
    expect(onResetUploadMock).toHaveBeenCalled();
  });
});
