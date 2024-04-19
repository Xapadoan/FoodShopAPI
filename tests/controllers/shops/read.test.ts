import express, { Application } from 'express';
import { validShopEntry } from '../../utils';
import request from 'supertest';
import { read } from '@controllers/shops/read';
import { publicShopMiddlewareMock } from '@mocks/middlewares/publicShop';

describe('Read Public shop', () => {
  let app: Application;
  beforeAll(() => {
    app = express();
    app.use(express.json({ type: 'application/json' }));
    app.get('/shops/:shopId', publicShopMiddlewareMock, read);
    app.get('/:shopId', read);
  });
  afterAll(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 404 if shop middleware was not called', async () => {
    const response = await request(app).get('/1');
    expect(publicShopMiddlewareMock).not.toHaveBeenCalled();
    expect(response.status).toEqual(404);
  });

  test('best case scenario', async () => {
    const response = await request(app).get('/shops/1');
    expect(publicShopMiddlewareMock).toHaveBeenCalled();
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject(validShopEntry);
  });
});
