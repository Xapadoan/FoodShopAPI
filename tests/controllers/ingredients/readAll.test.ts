import express from 'express';
import request from 'supertest';
import ingredientsRouter from '../../../src/controllers/ingredients';
import {
  Ingredient,
  IngredientsRepository,
} from '../../../src/repo/IngredientsRepository';
import { Entry } from '../../../src/repo/Repository';
import {
  expectResolvedValueEquals,
  expectResolvedValueMatch,
} from '../../utils';

describe('Ingredients Read All Controller', () => {
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
      .mockImplementation(async (_) => listResults);
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
    const responses = await Promise.all([
      request(app).get('/?name=n&page=n'),
      request(app).get('/?name=n&page=4&page=6'),
      request(app).get('/?name=n&page=4&name=m'),
    ]);
    expect(listSpy).not.toHaveBeenCalled();
    responses.forEach((res) => {
      expect(res.status).toEqual(400);
    });
  });

  it('should return a paginated list with status 200 and apply default filters', async () => {
    const response = await request(app).get('/');
    expect(listSpy).toHaveBeenCalledTimes(1);
    expect(listSpy).toHaveBeenCalledWith({ name: '', page: 0 });
    await expectResolvedValueMatch(listSpy, listResults);
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({
      page: 0,
      length: listResults.length,
      results: listResults,
    });
  });

  it('should accept optional query parameter', async () => {
    const responses = await Promise.all([
      request(app).get('/'),
      request(app).get('/?page=4'),
      request(app).get('/?name=n'),
      request(app).get('/?name=n&page=4'),
    ]);
    responses.forEach((res) => {
      expect(res.status).toEqual(200);
    });
  });

  it('should pass query parameters to list', async () => {
    await request(app).get('/?name=n&page=4');
    expect(listSpy).toHaveBeenCalledTimes(1);
    expect(listSpy).toHaveBeenCalledWith({ name: 'n', page: 4 });
  });

  it('should return empty pagination if list results is empty', async () => {
    listSpy.mockResolvedValueOnce([]);
    const response = await request(app).get('/');
    expect(listSpy).toHaveBeenCalledTimes(1);
    await expectResolvedValueEquals(listSpy, []);
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({
      page: 0,
      length: 0,
      results: [],
    });
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
