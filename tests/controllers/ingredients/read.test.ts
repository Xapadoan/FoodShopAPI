import express from 'express';
import request from 'supertest';
import ingredientsRouter from '../../../src/controllers/ingredients';
import {
  Ingredient,
  IngredientsRepository,
} from '../../../src/repo/IngredientsRepository';
import { Entry } from '../../../src/repo/Repository';

describe('Ingredients Read All Controller', () => {
  const readResult = {
    id: 1,
    name: 'eggs',
  };
  const app = express();
  let readSpy: jest.SpyInstance<
    Promise<Entry<Ingredient> | undefined>,
    [Partial<Entry<Ingredient>>],
    unknown
  >;
  beforeAll(() => {
    readSpy = jest
      .spyOn(IngredientsRepository.prototype, 'read')
      .mockImplementation(async (_) => readResult);
    app.use(express.json({ type: 'application/json' }));
    app.use('/', ingredientsRouter);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if param is not a number', async () => {
    try {
      const response = await request(app).get('/1e');
      expect(response.status).toEqual(400);
    } catch {
      expect(false).toBeTruthy();
    }
  });

  it('should return 404 if the ingredient does not exist', async () => {
    try {
      readSpy.mockImplementationOnce(
        async (_: Partial<Entry<Ingredient>>) => undefined
      );
      const response = await request(app).get('/42');
      expect(response.status).toEqual(404);
    } catch {
      expect(false).toBeTruthy();
    }
  });

  it('should return an ingredient with status 200', async () => {
    try {
      const response = await request(app).get('/1');
      expect(response.status).toEqual(200);
    } catch {
      expect(false).toBeTruthy();
    }
  });

  it('should call read with the id param and return the results', async () => {
    try {
      const response = await request(app).get('/1');
      expect(readSpy).toHaveBeenCalledTimes(1);
      expect(readSpy).toHaveBeenCalledWith({ id: 1 });
      expect(response.body).toMatchObject(readResult);
    } catch (error) {
      console.log(error);
      expect(false).toBeTruthy();
    }
  });

  it('should return 500 if anything throws', async () => {
    try {
      readSpy.mockImplementationOnce(async (_) => {
        throw new Error('Intentional read error');
      });
      const response = await request(app).get('/1');
      expect(response.status).toEqual(500);
    } catch {
      expect(false).toBeTruthy();
    }
  });
});
