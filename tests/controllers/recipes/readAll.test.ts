import express from 'express';
import request from 'supertest';
import recipesRouter from '../../../src/controllers/recipes';
import {
  Recipe,
  RecipePreview,
  RecipesRepository,
} from '../../../src/repo/RecipesRepository';

describe('Ingredients Read All Controller', () => {
  const listResults = [
    { id: 1, name: 'potatoes', numberOfPeople: 34 },
    { id: 2, name: 'milk', numberOfPeople: 2 },
  ];
  const app = express();
  let listSpy: jest.SpyInstance<
    Promise<RecipePreview[]>,
    [{ name: Recipe['name']; page: number }],
    unknown
  >;
  beforeAll(() => {
    listSpy = jest
      .spyOn(RecipesRepository.prototype, 'list')
      .mockImplementation(
        async (_: { name: Recipe['name']; page: number }) => listResults
      );
    app.use(express.json({ type: 'application/json' }));
    app.use('/', recipesRouter);
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
    } catch (error) {
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
