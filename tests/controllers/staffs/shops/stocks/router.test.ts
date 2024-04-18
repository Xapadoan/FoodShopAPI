import { routeMock } from '../../../../utils';

const createMock = jest.fn().mockImplementation(routeMock);
jest.mock('@controllers/staffs/shops/stocks/create', () => ({
  create: createMock,
}));
const updateMock = jest.fn().mockImplementation(routeMock);
jest.mock('@controllers/staffs/shops/stocks/update', () => ({
  update: updateMock,
}));

import request from 'supertest';
import express, { Application } from 'express';
import { stocksRouter } from '@controllers/staffs/shops/stocks';

describe('Private Shops Stocks router', () => {
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

  it('should use create on [POST] /', async () => {
    await request(app).post('/');
    expect(createMock).toHaveBeenCalled();
  });

  it('should use update on [PUT] /:stockId', async () => {
    await request(app).put('/1');
    expect(updateMock).toHaveBeenCalled();
  });
});
