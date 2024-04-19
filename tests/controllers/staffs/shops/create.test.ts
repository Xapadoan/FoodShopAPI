import express, { Application } from 'express';
import {
  expectResolved,
  validShop,
  validShopEntry,
  validStaffEntry,
} from '../../../utils';
import request from 'supertest';
import { create } from '@controllers/staffs/shops/create';
import { staffAuthMiddlewareMock } from '@mocks/middlewares/auth';
import { ShopsRepository, Shop } from '@repo/ShopsRepository';
import { Entry } from '@repo/Repository';

describe('Create shop endpoint', () => {
  let app: Application;
  let validateSpy: jest.SpyInstance<boolean, [unknown]>;
  let createSpy: jest.SpyInstance<Promise<Entry<Shop>>, [Shop]>;
  let addStaffSpy: jest.SpyInstance<Promise<void>, [number, number]>;
  beforeAll(() => {
    validateSpy = jest
      .spyOn(ShopsRepository.prototype, 'validate')
      .mockReturnValue(true);
    createSpy = jest
      .spyOn(ShopsRepository.prototype, 'create')
      .mockResolvedValue(validShopEntry);
    addStaffSpy = jest
      .spyOn(ShopsRepository.prototype, 'addStaff')
      .mockResolvedValue(undefined);
    app = express();
    app.use(express.json({ type: 'application/json' }));
    app.get('/shops', staffAuthMiddlewareMock, create);
    app.get('/', create);
  });
  afterAll(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if staff auth middleware was not called', async () => {
    const response = await request(app).get('/');
    expect(staffAuthMiddlewareMock).not.toHaveBeenCalled();
    expect(validateSpy).not.toHaveBeenCalled();
    expect(createSpy).not.toHaveBeenCalled();
    expect(response.status).toEqual(401);
  });

  it('should return 400 if validation fails', async () => {
    validateSpy.mockReturnValueOnce(false);
    const response = await request(app).get('/shops').send(validShop);
    expect(staffAuthMiddlewareMock).toHaveBeenCalled();
    expect(validateSpy).toHaveBeenCalledWith(validShop);
    expect(validateSpy).toHaveReturnedWith(false);
    expect(createSpy).not.toHaveBeenCalled();
    expect(response.status).toEqual(400);
  });

  test('best case scenario', async () => {
    const response = await request(app).get('/shops').send(validShop);
    expect(staffAuthMiddlewareMock).toHaveBeenCalled();
    expect(validateSpy).toHaveBeenCalledWith(validShop);
    expect(validateSpy).toHaveReturnedWith(true);
    expect(createSpy).toHaveBeenCalledWith(validShop);
    expectResolved(createSpy).toMatchObject(validShopEntry);
    expect(addStaffSpy).toHaveBeenCalledWith(
      validShopEntry.id,
      validStaffEntry.id
    );
    expect(response.status).toEqual(201);
    expect(response.body).toMatchObject(validShopEntry);
  });
});
