import express from 'express';
import request from 'supertest';
import ingredientsRouter from '../../../src/controllers/ingredients';
import {
  Ingredient,
  IngredientsRepository,
} from '../../../src/repo/IngredientsRepository';
import { Entry } from '../../../src/repo/Repository';
import { expectResolved } from '../../utils';

describe('Ingredients Read Controller', () => {
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
      .mockResolvedValue(readResult);
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
    const response = await request(app).get('/1e');
    expect(readSpy).not.toHaveBeenCalled();
    expect(response.status).toEqual(400);
  });

  it('should return 404 if the ingredient does not exist', async () => {
    readSpy.mockResolvedValueOnce(undefined);
    const response = await request(app).get('/42');
    expect(readSpy).toHaveBeenCalledTimes(1);
    expect(readSpy).toHaveBeenCalledWith({ id: 42 });
    expectResolved(readSpy).toBeUndefined();
    expect(response.status).toEqual(404);
  });

  it('should return an existing ingredient with status 200', async () => {
    const response = await request(app).get('/1');
    expect(readSpy).toHaveBeenCalledTimes(1);
    expect(readSpy).toHaveBeenCalledWith({ id: 1 });
    expectResolved(readSpy).toMatchObject(readResult);
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject(readResult);
  });

  it('should return 500 if anything throws', async () => {
    readSpy.mockImplementationOnce(async (_) => {
      throw new Error('Intentional read error');
    });
    const response = await request(app).get('/1');
    expect(response.status).toEqual(500);
  });
});
