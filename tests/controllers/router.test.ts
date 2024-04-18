import request from 'supertest';
import express, { Application } from 'express';
import { routeMock } from '../utils';

const authRouterMock = jest.fn().mockImplementation(routeMock);
jest.mock('@controllers/auth', () => authRouterMock);
const ingredientsRouterMock = jest.fn().mockImplementation(routeMock);
jest.mock('@controllers/ingredients', () => ingredientsRouterMock);
const recipesRouterMock = jest.fn().mockImplementation(routeMock);
jest.mock('@controllers/recipes', () => recipesRouterMock);
const shopsRouterMock = jest.fn().mockImplementation(routeMock);
jest.mock('@controllers/shops', () => ({
  publicShopsRouter: shopsRouterMock,
}));
const staffsRouterMock = jest.fn().mockImplementation(routeMock);
jest.mock('@controllers/staffs', () => staffsRouterMock);

import mainRouter from '@controllers/index';

describe('Main router', () => {
  let app: Application;
  beforeAll(() => {
    app = express();
    app.use(mainRouter);
  });
  afterAll(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should use auth router on [ALL] /auth', async () => {
    await Promise.all([
      request(app).get('/auth'),
      request(app).post('/auth'),
      request(app).put('/auth'),
      request(app).del('/auth'),
      request(app).patch('/auth'),
    ]);
    expect(authRouterMock).toHaveBeenCalledTimes(5);
  });

  it('should use ingredients router on [ALL] /ingredients', async () => {
    await Promise.all([
      request(app).get('/ingredients'),
      request(app).post('/ingredients'),
      request(app).put('/ingredients'),
      request(app).del('/ingredients'),
      request(app).patch('/ingredients'),
    ]);
  });

  it('should use recipes router on [ALL] /auth', async () => {
    await Promise.all([
      request(app).get('/recipes'),
      request(app).post('/recipes'),
      request(app).put('/recipes'),
      request(app).del('/recipes'),
      request(app).patch('/recipes'),
    ]);
    expect(recipesRouterMock).toHaveBeenCalledTimes(5);
  });

  it('should use shops router on [ALL] /auth', async () => {
    await Promise.all([
      request(app).get('/shops'),
      request(app).post('/shops'),
      request(app).put('/shops'),
      request(app).del('/shops'),
      request(app).patch('/shops'),
    ]);
    expect(shopsRouterMock).toHaveBeenCalledTimes(5);
  });

  it('should use staffs router on [ALL] /auth', async () => {
    await Promise.all([
      request(app).get('/staffs'),
      request(app).post('/staffs'),
      request(app).put('/staffs'),
      request(app).del('/staffs'),
      request(app).patch('/staffs'),
    ]);
    expect(staffsRouterMock).toHaveBeenCalledTimes(5);
  });
});
