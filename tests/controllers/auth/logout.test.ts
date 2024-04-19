import getMockedClient, { AuthClientMock } from '@mocks/lib/auth';
jest.mock('@lib/auth', () => getMockedClient);

import express, { Application } from 'express';
import request from 'supertest';
import { logout } from '@controllers/auth/logout';

describe('Logout endpoint', () => {
  let app: Application;
  beforeAll(() => {
    app = express();
    app.delete('/', logout);
  });
  afterAll(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete session when present', async () => {
    const response = await request(app)
      .delete('/')
      .set({ authorization: 'Bearer session-id' });
    expect(AuthClientMock.deleteSession).toHaveBeenCalled();
    expect(response.ok);
  });

  it('should still respond OK if session not present', async () => {
    const response = await request(app).delete('/');
    expect(AuthClientMock.deleteSession).not.toHaveBeenCalled();
    expect(response.ok);
  });

  it('should return 500 if anything throws', async () => {
    AuthClientMock.deleteSession.mockImplementationOnce(() => {
      throw new Error('Intentional deleteSession error');
    });
    const response = await request(app)
      .delete('/')
      .set({ authorization: 'Bearer session-id' });
    expect(AuthClientMock.deleteSession).toHaveBeenCalled();
    expect(response.serverError);
  });
});
