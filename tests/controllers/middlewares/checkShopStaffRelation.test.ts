import { checkShopStaffRelation } from '@controllers/middlewares/checkShopStaffRelation';
import { staffAuthMiddlewareMock } from '@mocks/middlewares/auth';
import { Entry } from '@repo/Repository';
import { Shop, ShopsRepository } from '@repo/ShopsRepository';
import express, { Application, Request, Response } from 'express';
import request from 'supertest';
import {
  expectRejected,
  expectResolved,
  routeMock,
  validShopEntry,
  validStaffEntry,
} from '../../utils';

describe('checkShopStaffRelation middleware', () => {
  let app: Application;
  let readStaffShopSpy: jest.SpyInstance<
    Promise<Entry<Shop> | undefined>,
    [number, number]
  >;
  let route: jest.Mock<Response, [Request, Response]>;
  beforeAll(() => {
    app = express();
    readStaffShopSpy = jest
      .spyOn(ShopsRepository.prototype, 'readStaffShop')
      .mockResolvedValue(validShopEntry);
    route = jest.fn(routeMock);
    app.use('/shops', staffAuthMiddlewareMock);
    app.get('/shops/:shopId', checkShopStaffRelation, route);
    app.get('/:shopId', checkShopStaffRelation, route);
  });
  afterAll(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if staffAuthMiddleware was not called', async () => {
    const response = await request(app).get('/1');
    expect(staffAuthMiddlewareMock).not.toHaveBeenCalled();
    expect(readStaffShopSpy).not.toHaveBeenCalled();
    expect(route).not.toHaveBeenCalled();
    expect(response.status).toEqual(401);
  });

  it('should return 400 if query param is not an integer', async () => {
    const responses = await Promise.all([
      request(app).get('/shops/qwe'),
      request(app).get('/shops/0.123'),
    ]);

    expect(staffAuthMiddlewareMock).toHaveBeenCalledTimes(responses.length);
    expect(readStaffShopSpy).not.toHaveBeenCalled();
    expect(route).not.toHaveBeenCalled();
    responses.forEach((response) => {
      expect(response.status).toEqual(400);
    });
  });

  it('should return 404 if shop if not found', async () => {
    readStaffShopSpy.mockResolvedValueOnce(undefined);
    const response = await request(app).get('/shops/1');
    expect(staffAuthMiddlewareMock).toHaveBeenCalled();
    expect(readStaffShopSpy).toHaveBeenCalledWith(validStaffEntry.id, 1);
    expectResolved(readStaffShopSpy).toBeUndefined();
    expect(route).not.toHaveBeenCalled();
    expect(response.status).toEqual(404);
  });

  it('should return 500 if anything throws', async () => {
    readStaffShopSpy.mockImplementationOnce(() => {
      throw new Error('Intentional readShopStaff error');
    });
    const response = await request(app).get('/shops/1');
    expect(readStaffShopSpy).toHaveBeenCalled();
    expectRejected(readStaffShopSpy);
    expect(route).not.toHaveBeenCalled();
    expect(response.status).toEqual(500);
  });

  test('best case scenario', async () => {
    await request(app).get('/shops/1');
    expect(readStaffShopSpy).toHaveBeenCalledWith(validStaffEntry.id, 1);
    expectResolved(readStaffShopSpy).toMatchObject(validShopEntry);
    expect(route).toHaveBeenCalled();
    const req = route.mock.calls[0][0];
    expect(req.shop).toMatchObject(validShopEntry);
  });
});
