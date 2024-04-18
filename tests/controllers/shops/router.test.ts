import { routeMock } from '../../utils';

const stocksRouterMock = jest.fn().mockImplementation(routeMock);
jest.mock('@controllers/shops/stocks', () => ({
  stocksRouter: stocksRouterMock,
}));
const readMock = jest.fn().mockImplementation(routeMock);
jest.mock('@controllers/shops/read', () => ({ read: readMock }));

import { publicShopMiddlewareMock } from '@mocks/middlewares/publicShop';
jest.mock('@controllers/middlewares/publicShop', () => ({
  publicShop: publicShopMiddlewareMock,
}));

import request from 'supertest';
import express, { Application } from 'express';
import { publicShopsRouter } from '@controllers/shops';

describe('Public shops router', () => {
  let app: Application;
  beforeAll(() => {
    app = express();
    app.use(publicShopsRouter);
  });
  afterAll(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should use stocksRouter on [All] /:shopId/stocks', async () => {
    await Promise.all([
      request(app).get('/1/stocks'),
      request(app).post('/1/stocks'),
      request(app).put('/1/stocks'),
      request(app).del('/1/stocks'),
      request(app).patch('/1/stocks'),
    ]);
    expect(stocksRouterMock).toHaveBeenCalledTimes(5);
    expect(publicShopMiddlewareMock).toHaveBeenCalledTimes(5);
  });

  it('should use read on [GET] /:shopId', async () => {
    await request(app).get('/1');
    expect(readMock).toHaveBeenCalled();
    expect(publicShopMiddlewareMock).toHaveBeenCalled();
  });
});
