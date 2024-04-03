import express from 'express';
import request from 'supertest';
import recipesRouter from '../../../src/controllers/recipes';
import { Recipe, RecipesRepository } from '../../../src/repo/RecipesRepository';
import { Entry } from '../../../src/repo/Repository';
import { expectResolved } from '../../utils';

describe('Recipes Read Controller', () => {
  const readResult = {
    id: 1,
    name: 'Boiled egg',
    numberOfPeople: 4,
    steps: [
      { ranking: 1, text: 'Make the water boil' },
      { ranking: 2, text: 'Put the eggs in the water without breaking it' },
      { ranking: 3, text: 'After 10 minutes, put the eggs out of the water' },
      { ranking: 4, text: 'Wait for the eggs to cool down and peel them' },
    ],
    ingredients: [
      { id: 1, quantity: '1/2 liter' },
      { id: 2, quantity: '4' },
    ],
  };
  const app = express();
  let readSpy: jest.SpyInstance<
    Promise<Entry<Recipe> | undefined>,
    [{ id: number }],
    unknown
  >;
  beforeAll(() => {
    readSpy = jest
      .spyOn(RecipesRepository.prototype, 'read')
      .mockResolvedValue(readResult);
    app.use(express.json({ type: 'application/json' }));
    app.use('/', recipesRouter);
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

  it('should return 404 if the recipe does not exist', async () => {
    readSpy.mockResolvedValueOnce(undefined);
    const response = await request(app).get('/42');
    expect(readSpy).toHaveBeenCalledTimes(1);
    expect(readSpy).toHaveBeenCalledWith({ id: 42 });
    expectResolved(readSpy).toBeUndefined();
    expect(response.status).toEqual(404);
  });

  it('should call read with the id param and return the results', async () => {
    const response = await request(app).get('/1');
    expect(readSpy).toHaveBeenCalledTimes(1);
    expect(readSpy).toHaveBeenCalledWith({ id: 1 });
    expectResolved(readSpy).toMatchObject(readResult);
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject(readResult);
  });

  it('should return 500 if anything throws', async () => {
    readSpy.mockImplementationOnce((_) => {
      throw new Error('Intentional read error');
    });
    const response = await request(app).get('/1');
    expect(response.status).toEqual(500);
  });
});
