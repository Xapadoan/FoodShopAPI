import { create } from '@controllers/staffs/shops/stocks/create';
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

describe('Create Stock endpoint', () => {
  let app: Application;
  let validateStockSpy: jest.SpyInstance<boolean, [Stock]>;
  let createStockSpy: jest.SpyInstance<Promise<Entry<Stock>>, [Stock]>;
  beforeAll(() => {
    validateStockSpy = jest
      .spyOn(StocksRepository.prototype, 'validate')
      .mockReturnValue(true);
    createStockSpy = jest
      .spyOn(StocksRepository.prototype, 'create')
      .mockResolvedValue(validStockEntry);
    app = express();
    app.use(express.json({ type: 'application/json' }));
    app.use('/stocks', staffAuthMiddlewareMock, checkShopStaffRelationMock);
    app.post('/stocks', create);
    app.post('/no-auth', create);
    app.post('/no-shop', staffAuthMiddlewareMock, create);
  });
  afterAll(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if auth middleware was not called', async () => {
    const response = await request(app).post('/no-auth');
    expect(staffAuthMiddlewareMock).not.toHaveBeenCalled();
    expect(createStockSpy).not.toHaveBeenCalled();
    expect(response.status).toEqual(401);
  });

  it('should return 404 if checkRelation middleware was not called', async () => {
    const response = await request(app).post('/no-shop');
    expect(staffAuthMiddlewareMock).toHaveBeenCalled();
    expect(checkShopStaffRelationMock).not.toHaveBeenCalled();
    expect(createStockSpy).not.toHaveBeenCalled();
    expect(response.status).toEqual(404);
  });

  it('should return 400 when stock validation fails', async () => {
    validateStockSpy.mockReturnValueOnce(false);
    const response = await request(app).post('/stocks').send(validStock);
    expect(staffAuthMiddlewareMock).toHaveBeenCalled();
    expect(checkShopStaffRelationMock).toHaveBeenCalled();
    expect(validateStockSpy).toHaveBeenCalledWith(validStock);
    expect(validateStockSpy).toHaveReturnedWith(false);
    expect(response.status).toEqual(400);
  });

  it('should return 500 if anything throws', async () => {
    createStockSpy.mockImplementationOnce(async () => {
      throw new Error('Intentional list error');
    });
    const response = await request(app).post('/stocks');
    expectRejected(createStockSpy).toBeTruthy();
    expect(response.status).toEqual(500);
  });

  test('best case scenario', async () => {
    const response = await request(app).post('/stocks').send(validStock);
    expect(staffAuthMiddlewareMock).toHaveBeenCalled();
    expect(checkShopStaffRelationMock).toHaveBeenCalled();
    expect(validateStockSpy).toHaveBeenCalledWith(validStock);
    expect(validateStockSpy).toHaveReturnedWith(true);
    expect(createStockSpy).toHaveBeenCalledWith(validStock);
    expectResolved(createStockSpy).toMatchObject(validStockEntry);
    expect(response.status).toEqual(201);
    expect(response.body).toMatchObject(validStockEntry);
  });
});
