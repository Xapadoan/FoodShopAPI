import { readAll } from '@controllers/shops/stocks/readAll';
import { publicShopMiddlewareMock } from '@mocks/middlewares/publicShop';
import { Entry } from '@repo/Repository';
import { Stock, StocksRepository } from '@repo/StocksRepository';
import express, { Application } from 'express';
import { validStockEntry, expectResolved } from '../../../utils';
import request from 'supertest';

describe('Public shops stocks readAll endpoint', () => {
  let app: Application;
  let listSpy: jest.SpyInstance<
    Promise<Entry<Stock>[]>,
    [{ shopId: number }, number]
  >;
  beforeAll(() => {
    listSpy = jest
      .spyOn(StocksRepository.prototype, 'list')
      .mockResolvedValue([validStockEntry]);
    app = express();
    app.use('/shops/:shopId', publicShopMiddlewareMock);
    app.get('/shops/:shopId/stocks', readAll);
    app.get('/:shopId/stocks', readAll);
  });
  afterAll(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 404 if public shop middleware not called', async () => {
    const response = await request(app).get('/1/stocks');
    expect(publicShopMiddlewareMock).not.toHaveBeenCalled();
    expect(response.status).toEqual(404);
  });

  it('should return 400 if query string is not valid', async () => {
    const responses = await Promise.all([
      request(app).get('/shops/1/stocks?page=n'),
      request(app).get('/shops/1/stocks?page=4&page=6'),
    ]);
    expect(publicShopMiddlewareMock).toHaveBeenCalledTimes(2);
    expect(listSpy).not.toHaveBeenCalled();
    responses.forEach((res) => {
      expect(res.status).toEqual(400);
    });
  });

  it('should return a paginated list with status 200 and apply default filters', async () => {
    const response = await request(app).get('/shops/1/stocks');
    expect(publicShopMiddlewareMock).toHaveBeenCalled();
    expect(listSpy).toHaveBeenCalledTimes(1);
    expect(listSpy).toHaveBeenCalledWith({ shopId: 1 }, 0);
    expectResolved(listSpy).toMatchObject([validStockEntry]);
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({
      page: 0,
      length: 1,
      results: [validStockEntry],
    });
  });

  it('should return empty pagination if list results is empty', async () => {
    listSpy.mockResolvedValueOnce([]);
    const response = await request(app).get('/shops/1/stocks');
    expect(publicShopMiddlewareMock).toHaveBeenCalled();
    expect(listSpy).toHaveBeenCalledTimes(1);
    expectResolved(listSpy).toEqual([]);
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({
      page: 0,
      length: 0,
      results: [],
    });
  });

  it('should return 500 if anything throws', async () => {
    listSpy.mockImplementationOnce((_) => {
      throw new Error('Intentional list error');
    });
    const response = await request(app).get('/shops/1/stocks');
    expect(response.status).toEqual(500);
  });
});
