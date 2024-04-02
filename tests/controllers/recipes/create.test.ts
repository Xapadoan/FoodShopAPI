import express from 'express';
import request from 'supertest';
import recipesRouter from '../../../src/controllers/recipes';
import { IngredientsRepository } from '../../../src/repo/IngredientsRepository';
import { Recipe, RecipesRepository } from '../../../src/repo/RecipesRepository';
import { Entry } from '../../../src/repo/Repository';
import { expectResolved } from '../../utils';

const validRecipe = {
  name: 'n',
  numberOfPeople: 4,
  steps: [{ ranking: 1, text: 'n' }],
  ingredients: [{ id: 1, quantity: 'n' }],
};

const validResponse = {
  id: 1,
  ...validRecipe,
};

describe('Recipes Create Controller', () => {
  const app = express();
  let createSpy: jest.SpyInstance<Promise<Entry<Recipe>>, Recipe[], unknown>;
  let checkIngredientsSpy: jest.SpyInstance<
    Promise<boolean>,
    Array<number>[],
    unknown
  >;
  let validateSpy: jest.SpyInstance<boolean, Recipe[], unknown>;
  beforeAll(() => {
    createSpy = jest
      .spyOn(RecipesRepository.prototype, 'create')
      .mockResolvedValue(validResponse);
    checkIngredientsSpy = jest
      .spyOn(IngredientsRepository.prototype, 'checkExistence')
      .mockResolvedValue(true);
    validateSpy = jest
      .spyOn(RecipesRepository.prototype, 'validate')
      .mockReturnValue(true);
    app.use(express.json({ type: 'application/json' }));
    app.use('/', recipesRouter);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should reject invalid payloads with 400', async () => {
    validateSpy.mockReturnValueOnce(false);
    const response = await request(app).post('/').send(validRecipe);
    expect(validateSpy).toHaveBeenCalledTimes(1);
    expect(validateSpy).toHaveBeenCalledWith(validRecipe);
    expect(validateSpy).toHaveReturnedWith(false);
    expect(checkIngredientsSpy).not.toHaveBeenCalled();
    expect(createSpy).not.toHaveBeenCalled();
    expect(response.status).toEqual(400);
  });

  it('should reject non-existing ingredients with 400', async () => {
    checkIngredientsSpy.mockResolvedValueOnce(false);
    const response = await request(app).post('/').send(validRecipe);
    expect(validateSpy).toHaveBeenCalledTimes(1);
    expect(validateSpy).toHaveBeenCalledWith(validRecipe);
    expect(validateSpy).toHaveReturnedWith(true);
    expect(checkIngredientsSpy).toHaveBeenCalledTimes(1);
    expect(checkIngredientsSpy).toHaveBeenCalledWith(
      validRecipe.ingredients.map(({ id }) => id)
    );
    expectResolved(checkIngredientsSpy).toEqual(false);
    expect(createSpy).not.toHaveBeenCalled();
    expect(response.status).toEqual(400);
  });

  it('should create a recipe when payload is valid', async () => {
    const response = await request(app).post('/').send(validRecipe);
    expect(validateSpy).toHaveBeenCalledTimes(1);
    expect(validateSpy).toHaveBeenCalledWith(validRecipe);
    expect(validateSpy).toHaveReturnedWith(true);
    expect(checkIngredientsSpy).toHaveBeenCalled();
    expect(checkIngredientsSpy).toHaveBeenCalledWith(
      validRecipe.ingredients.map(({ id }) => id)
    );
    expectResolved(checkIngredientsSpy).toEqual(true);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledWith(validRecipe);
    expectResolved(createSpy).toMatchObject(validRecipe);
    expect(response.status).toEqual(201);
    expect(response.body).toMatchObject(validResponse);
  });

  it('should return 500 if anything throws', async () => {
    validateSpy.mockImplementationOnce((_) => {
      throw new Error('Intentional validation error');
    });
    checkIngredientsSpy.mockImplementationOnce(async (_) => {
      throw new Error('Intentional check ingredients error');
    });
    createSpy.mockImplementationOnce(async (_) => {
      throw new Error('Intentional create error');
    });
    const promises = await Promise.all([
      request(app).post('/').send(validRecipe),
      request(app).post('/').send(validRecipe),
      request(app).post('/').send(validRecipe),
    ]);
    promises.forEach((res) => {
      expect(res.status).toEqual(500);
    });
  });
});
