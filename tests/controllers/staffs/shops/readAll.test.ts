import { Shop, ShopsRepository } from '@repo/ShopsRepository';
import { Entry } from '@repo/Repository';
import express, { Application } from 'express';
import { readAll } from '@controllers/staffs/shops/readAll';
import { staffAuthMiddlewareMock } from '@mocks/middlewares/auth';
import request from 'supertest';
import {
  validShopEntry,
  expectResolved,
  expectRejected,
  validStaffEntry,
} from '../../../utils';

describe('Private shops readAll', () => {
  let app: Application;
  let listStaffShopsSpy: jest.SpyInstance<
    Promise<Shop[]>,
    [number, Partial<Entry<Shop>>, number]
  >;
  beforeAll(() => {
    listStaffShopsSpy = jest
      .spyOn(ShopsRepository.prototype, 'listStaffShops')
      .mockResolvedValue([validShopEntry]);
    app = express();
    app.use('/shops', staffAuthMiddlewareMock, readAll);
    app.get('/', readAll);
  });
  afterAll(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 when staff auth middleware not set', async () => {
    const response = await request(app).get('/');
    expect(staffAuthMiddlewareMock).not.toHaveBeenCalled();
    expect(listStaffShopsSpy).not.toHaveBeenCalled();
    expect(response.status).toEqual(401);
  });

  it('should return 400 when query is bad', async () => {
    const responses = await Promise.all([
      request(app).get('/shops?page=asd'),
      request(app).get('/shops?name=asd&name=qwe'),
    ]);
    expect(staffAuthMiddlewareMock).toHaveBeenCalled();
    expect(listStaffShopsSpy).not.toHaveBeenCalled();
    responses.forEach((response) => {
      expect(response.status).toEqual(400);
    });
  });

  it('should return a paginated list with status 200 and apply default filters', async () => {
    const response = await request(app).get('/shops');
    expect(staffAuthMiddlewareMock).toHaveBeenCalled();
    expect(listStaffShopsSpy).toHaveBeenCalledTimes(1);
    expect(listStaffShopsSpy).toHaveBeenCalledWith(
      validStaffEntry.id,
      { name: '' },
      0
    );
    expectResolved(listStaffShopsSpy).toMatchObject([validShopEntry]);
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({
      page: 0,
      length: 1,
      results: [validShopEntry],
    });
  });

  it('should return a paginated list with status 200 and apply custom filters', async () => {
    const response = await request(app).get('/shops?page=2&name=bout');
    expect(staffAuthMiddlewareMock).toHaveBeenCalled();
    expect(listStaffShopsSpy).toHaveBeenCalledTimes(1);
    expect(listStaffShopsSpy).toHaveBeenCalledWith(
      validStaffEntry.id,
      { name: 'bout' },
      2
    );
    expectResolved(listStaffShopsSpy).toMatchObject([validShopEntry]);
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({
      page: 2,
      length: 1,
      results: [validShopEntry],
    });
  });

  it('should return empty pagination if list results is empty', async () => {
    listStaffShopsSpy.mockResolvedValueOnce([]);
    const response = await request(app).get('/shops');
    expect(staffAuthMiddlewareMock).toHaveBeenCalled();
    expect(listStaffShopsSpy).toHaveBeenCalledTimes(1);
    expectResolved(listStaffShopsSpy).toEqual([]);
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({
      page: 0,
      length: 0,
      results: [],
    });
  });

  it('should return 500 if anything throws', async () => {
    listStaffShopsSpy.mockImplementationOnce(async (_) => {
      throw new Error('Intentional list error');
    });
    const response = await request(app).get('/shops/1/stocks');
    expectRejected(listStaffShopsSpy).toBeTruthy();
    expect(response.status).toEqual(500);
  });
});
