import { update } from '@controllers/staffs/shops/stocks/update';
import { staffAuthMiddlewareMock } from '@mocks/middlewares/auth';
import { checkShopStaffRelationMock } from '@mocks/middlewares/checkShopStaffRelation';
import { Entry } from '@repo/Repository';
import { Stock, StocksRepository } from '@repo/StocksRepository';
import express, { Application } from 'express';
import request from 'supertest';
import {
  expectRejected,
  expectResolved,
  validStock,
  validStockEntry,
} from '../../../../utils';

describe('Update Stock endpoint', () => {
  let app: Application;
  let validateStockSpy: jest.SpyInstance<boolean, [Stock]>;
  let updateStockSpy: jest.SpyInstance<
    Promise<Entry<Stock> | undefined>,
    [number, Partial<Stock>]
  >;
  beforeAll(() => {
    validateStockSpy = jest
      .spyOn(StocksRepository.prototype, 'validate')
      .mockReturnValue(true);
    updateStockSpy = jest
      .spyOn(StocksRepository.prototype, 'update')
      .mockResolvedValue(validStockEntry);
    app = express();
    app.use(express.json({ type: 'application/json' }));
    app.use(
      '/:shopId/stocks/:stockId',
      staffAuthMiddlewareMock,
      checkShopStaffRelationMock,
      update
    );
    app.put('/no-param', update);
    app.put('/no-auth/:stockId', update);
    app.put('/no-shop/:stockId', [staffAuthMiddlewareMock, update]);
  });
  afterAll(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if no param was provided', async () => {
    const response = await request(app).put('/no-param');
    expect(updateStockSpy).not.toHaveBeenCalled();
    expect(response.status).toEqual(400);
  });

  it('should return 401 if auth middleware was not called', async () => {
    const response = await request(app).put('/no-auth/1');
    expect(staffAuthMiddlewareMock).not.toHaveBeenCalled();
    expect(updateStockSpy).not.toHaveBeenCalled();
    expect(response.status).toEqual(401);
  });

  it('should return 404 if checkRelation middleware was not called', async () => {
    const response = await request(app).put('/no-shop/1');
    expect(staffAuthMiddlewareMock).toHaveBeenCalled();
    expect(checkShopStaffRelationMock).not.toHaveBeenCalled();
    expect(updateStockSpy).not.toHaveBeenCalled();
    expect(response.status).toEqual(404);
  });

  it('should return 400 when stock validation fails', async () => {
    validateStockSpy.mockReturnValueOnce(false);
    const response = await request(app).post('/1/stocks/1').send(validStock);
    expect(staffAuthMiddlewareMock).toHaveBeenCalled();
    expect(checkShopStaffRelationMock).toHaveBeenCalled();
    expect(validateStockSpy).toHaveBeenCalledWith(validStock);
    expect(validateStockSpy).toHaveReturnedWith(false);
    expect(response.status).toEqual(400);
  });

  it('should return 404 if stockId not found', async () => {
    updateStockSpy.mockResolvedValueOnce(undefined);
    const response = await request(app).post('/1/stocks/1').send(validStock);
    expect(staffAuthMiddlewareMock).toHaveBeenCalled();
    expect(checkShopStaffRelationMock).toHaveBeenCalled();
    expect(validateStockSpy).toHaveBeenCalledWith(validStock);
    expect(validateStockSpy).toHaveReturnedWith(true);
    expect(updateStockSpy).toHaveBeenCalledWith(1, validStock);
    expectResolved(updateStockSpy).toBeUndefined();
    expect(response.status).toEqual(404);
  });

  it('should return 500 if anything throws', async () => {
    updateStockSpy.mockImplementationOnce(async () => {
      throw new Error('Intentional list error');
    });
    const response = await request(app).post('/1/stocks/1');
    expectRejected(updateStockSpy).toBeTruthy();
    expect(response.status).toEqual(500);
  });

  test('best case scenario', async () => {
    const response = await request(app).post('/1/stocks/1').send(validStock);
    expect(staffAuthMiddlewareMock).toHaveBeenCalled();
    expect(checkShopStaffRelationMock).toHaveBeenCalled();
    expect(validateStockSpy).toHaveBeenCalledWith(validStock);
    expect(validateStockSpy).toHaveReturnedWith(true);
    expect(updateStockSpy).toHaveBeenCalledWith(1, validStock);
    expectResolved(updateStockSpy).toMatchObject(validStockEntry);
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject(validStockEntry);
  });
});
