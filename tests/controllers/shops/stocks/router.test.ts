import { routeMock } from '../../../utils';

const readAllMock = jest.fn().mockImplementation(routeMock);
jest.mock('@controllers/shops/stocks/readAll', () => ({
  readAll: readAllMock,
}));

import request from 'supertest';
import express, { Application } from 'express';
import { stocksRouter } from '@controllers/shops/stocks';

describe('Public shops stocks router', () => {
  let app: Application;
  beforeAll(() => {
    app = express();
    app.use(stocksRouter);
  });
  afterAll(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should use readAll on [GET] /', async () => {
    await request(app).get('/');
    expect(readAllMock).toHaveBeenCalled();
  });
});
