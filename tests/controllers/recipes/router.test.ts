import { routeMock } from '../../utils';

const createMock = jest.fn().mockImplementation(routeMock);
jest.mock('@controllers/recipes/create', () => ({ create: createMock }));
const readMock = jest.fn().mockImplementation(routeMock);
jest.mock('@controllers/recipes/read', () => ({ read: readMock }));
const readAllMock = jest.fn().mockImplementation(routeMock);
jest.mock('@controllers/recipes/readAll', () => ({ readAll: readAllMock }));

import request from 'supertest';
import express, { Application } from 'express';
import recipesRouter from '@controllers/recipes';

describe('Recipes router', () => {
  let app: Application;
  beforeAll(() => {
    app = express();
    app.use(recipesRouter);
  });
  afterAll(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should use create on [POST] /', async () => {
    await request(app).post('/');
    expect(createMock).toHaveBeenCalled();
  });

  it('should use read on [GET] /:id', async () => {
    await request(app).get('/123');
    expect(readMock).toHaveBeenCalled();
  });

  it('should use readAll on [GET] /', async () => {
    await request(app).get('/');
    expect(readAllMock).toHaveBeenCalled();
  });
});
