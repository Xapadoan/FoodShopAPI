import express, { Application } from 'express';
import { validStaffEntry } from '../../utils';
import request from 'supertest';
import { me } from '@controllers/staffs/me';
import { staffAuthMiddlewareMock } from '@mocks/middlewares/auth';

describe('Read me endpoint', () => {
  let app: Application;
  beforeAll(() => {
    app = express();
    app.use(express.json({ type: 'application/json' }));
    app.get('/staffs', staffAuthMiddlewareMock, me);
    app.get('/', me);
  });
  afterAll(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if staff auth middleware was not called', async () => {
    const response = await request(app).get('/');
    expect(staffAuthMiddlewareMock).not.toHaveBeenCalled();
    expect(response.status).toEqual(401);
  });

  test('best case scenario', async () => {
    const response = await request(app).get('/staffs');
    expect(staffAuthMiddlewareMock).toHaveBeenCalled();
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject(validStaffEntry);
  });
});
