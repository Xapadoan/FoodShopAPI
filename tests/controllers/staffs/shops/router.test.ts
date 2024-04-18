import { routeMock } from '../../../utils';

const stocksRouterMock = jest.fn().mockImplementation(routeMock);
jest.mock('@controllers/staffs/shops/stocks', () => ({
  stocksRouter: stocksRouterMock,
}));
const createMock = jest.fn().mockImplementation(routeMock);
jest.mock('@controllers/staffs/shops/create', () => ({ create: createMock }));
const readAllMock = jest.fn().mockImplementation(routeMock);
jest.mock('@controllers/staffs/shops/readAll', () => ({
  readAll: readAllMock,
}));

import { checkShopStaffRelationMock } from '@mocks/middlewares/checkShopStaffRelation';

jest.mock('@controllers/middlewares/checkShopStaffRelation', () => ({
  checkShopStaffRelation: checkShopStaffRelationMock,
}));

import request from 'supertest';
import express, { Application } from 'express';
import shopsRouter from '@controllers/staffs/shops';

describe('Private Shops router', () => {
  let app: Application;
  beforeAll(() => {
    app = express();
    app.use(shopsRouter);
  });
  afterAll(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should use the stocks router on [ALL] /:shopId/stocks', async () => {
    await Promise.all([
      request(app).get('/1/stocks'),
      request(app).post('/1/stocks'),
      request(app).put('/1/stocks'),
      request(app).del('/1/stocks'),
      request(app).patch('/1/stocks'),
    ]);
    expect(stocksRouterMock).toHaveBeenCalledTimes(5);
    expect(checkShopStaffRelationMock).toHaveBeenCalledTimes(5);
  });

  it('should use create on [POST] /', async () => {
    await request(app).post('/');
    expect(createMock).toHaveBeenCalled();
  });

  it('should use readAll on [GET] /', async () => {
    await request(app).get('/');
    expect(readAllMock).toHaveBeenCalled();
  });
});
