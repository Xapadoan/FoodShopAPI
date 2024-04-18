import { routeMock } from '../../utils';

const createMock = jest.fn().mockImplementation(routeMock);
jest.mock('@controllers/ingredients/create', () => ({ create: createMock }));
const readMock = jest.fn().mockImplementation(routeMock);
jest.mock('@controllers/ingredients/read', () => ({ read: readMock }));
const readAllMock = jest.fn().mockImplementation(routeMock);
jest.mock('@controllers/ingredients/readAll', () => ({ readAll: readAllMock }));

import request from 'supertest';
import express, { Application } from 'express';
import ingredientsRouter from '@controllers/ingredients';

describe('Ingredients router', () => {
  let app: Application;
  beforeAll(() => {
    app = express();
    app.use(ingredientsRouter);
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
