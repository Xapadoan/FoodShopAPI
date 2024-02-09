import express from 'express';
import request from 'supertest';
import ingredientsRouter from '../../../src/controllers/ingredients';
import {
  Ingredient,
  IngredientsRepository,
} from '../../../src/repo/IngredientsRepository';
import { Entry } from '../../../src/repo/Repository';

describe('Read All Controller', () => {
  const listResults = [
    { id: 1, name: 'potatoes' },
    { id: 2, name: 'milk' },
  ];
  const app = express();
  let listSpy: jest.SpyInstance<
    Promise<Entry<Ingredient>[]>,
    [{ name: Ingredient['name']; page: number }],
    unknown
  >;
  beforeAll(() => {
    listSpy = jest
      .spyOn(IngredientsRepository.prototype, 'list')
      .mockImplementation(
        async (_: { name: string; page: number }) => listResults
      );
    app.use(express.json({ type: 'application/json' }));
    app.use('/', ingredientsRouter);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if query string is not valid', async () => {
    try {
      const responses = await Promise.all([
        request(app).get('/?name=n&page=n'),
        request(app).get('/?name=n&page=4&page=6'),
        request(app).get('/?name=n&page=4&name=m'),
      ]);
      responses.forEach((res) => {
        expect(res.status).toEqual(400);
      });
    } catch {
      expect(false).toBeTruthy();
    }
  });

  it('should return a paginated list with status 200', async () => {
    try {
      const response = await request(app).get('/');
      expect(response.status).toEqual(200);
      const { page, length, results } = response.body;
      expect(typeof page).toEqual('number');
      expect(typeof length).toEqual('number');
      expect(Array.isArray(results)).toBeTruthy();
    } catch {
      expect(false).toBeTruthy();
    }
  });

  it('should accept optional query parameter', async () => {
    try {
      const responses = await Promise.all([
        request(app).get('/'),
        request(app).get('/?page=4'),
        request(app).get('/?name=n'),
        request(app).get('/?name=n&page=4'),
      ]);
      responses.forEach((res) => {
        expect(res.status).toEqual(200);
      });
    } catch {
      expect(false).toBeTruthy();
    }
  });

  it('should pass query parameters to list', async () => {
    try {
      const response = await request(app).get('/?name=n&page=4');
      expect(listSpy).toHaveBeenCalledTimes(1);
      expect(listSpy).toHaveBeenCalledWith({ name: 'n', page: 4 });
      expect(response.body.results).toEqual(listResults);
    } catch {
      expect(false).toBeTruthy();
    }
  });

  it('should return 500 if anything throws', async () => {
    try {
      listSpy.mockImplementationOnce((_) => {
        throw new Error('Intentional list error');
      });
      const response = await request(app).get('/');
      expect(response.status).toEqual(500);
    } catch {
      expect(false).toBeTruthy();
    }
  });
});
