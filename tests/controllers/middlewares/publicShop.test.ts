import { Entry } from '@repo/Repository';
import { Shop, ShopsRepository } from '@repo/ShopsRepository';
import express, { Application, Request, Response } from 'express';
import {
  routeMock,
  expectResolved,
  expectRejected,
  validShopEntry,
} from '../../utils';
import { publicShop } from '@controllers/middlewares/publicShop';
import request from 'supertest';

describe('Public Shop Middleware', () => {
  let app: Application;
  let readShopSpy: jest.SpyInstance<
    Promise<Entry<Shop> | undefined>,
    [Partial<Entry<Shop>>]
  >;
  let route: jest.Mock<Response, [Request, Response]>;
  beforeAll(() => {
    route = jest.fn(routeMock);
    readShopSpy = jest
      .spyOn(ShopsRepository.prototype, 'read')
      .mockResolvedValue(validShopEntry);
    app = express();
    app.use('/:shopId', publicShop, route);
  });
  afterAll(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if query param is not an integer', async () => {
    const responses = await Promise.all([
      request(app).get('/qwe'),
      request(app).get('/0.123'),
    ]);

    expect(readShopSpy).not.toHaveBeenCalled();
    expect(route).not.toHaveBeenCalled();
    responses.forEach((response) => {
      expect(response.status).toEqual(400);
    });
  });

  it('should return 404 if shop if not found', async () => {
    readShopSpy.mockResolvedValueOnce(undefined);
    const response = await request(app).get('/1');
    expect(readShopSpy).toHaveBeenCalledWith({ id: 1 });
    expectResolved(readShopSpy).toBeUndefined();
    expect(route).not.toHaveBeenCalled();
    expect(response.status).toEqual(404);
  });

  it('should return 500 if anything throws', async () => {
    readShopSpy.mockImplementationOnce(() => {
      throw new Error('Intentional readShopStaff error');
    });
    const response = await request(app).get('/1');
    expect(readShopSpy).toHaveBeenCalled();
    expectRejected(readShopSpy);
    expect(route).not.toHaveBeenCalled();
    expect(response.status).toEqual(500);
  });

  test('best case scenario', async () => {
    await request(app).get('/1');
    expect(readShopSpy).toHaveBeenCalledWith({ id: 1 });
    expectResolved(readShopSpy).toMatchObject(validShopEntry);
    expect(route).toHaveBeenCalled();
    const req = route.mock.calls[0][0];
    expect(req.shop).toMatchObject(validShopEntry);
  });
});
