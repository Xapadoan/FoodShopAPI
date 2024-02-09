import express from 'express';
import request from 'supertest';
import recipesRouter from '../../../src/controllers/recipes';
import { IngredientsRepository } from '../../../src/repo/IngredientsRepository';
import { Recipe, RecipesRepository } from '../../../src/repo/RecipesRepository';
import { Entry } from '../../../src/repo/Repository';

const validRecipe = {
  name: 'n',
  numberOfPeople: 4,
  steps: [{ ranking: 1, text: 'n' }],
  ingredients: [{ id: 1, quantity: 'n' }],
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
      .mockImplementation(async (recipe) => ({ id: 1, ...recipe }));
    checkIngredientsSpy = jest
      .spyOn(IngredientsRepository.prototype, 'checkExistence')
      .mockImplementation(async (_) => true);
    validateSpy = jest.spyOn(RecipesRepository.prototype, 'validate');
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
    try {
      validateSpy.mockImplementationOnce((_) => false);
      const response = await request(app).post('/').send(validRecipe);
      expect(validateSpy).toHaveBeenCalledTimes(1);
      expect(validateSpy).toHaveBeenCalledWith(validRecipe);
      expect(checkIngredientsSpy).not.toHaveBeenCalled();
      expect(createSpy).not.toHaveBeenCalled();
      expect(response.status).toEqual(400);
    } catch {
      expect(false).toBeTruthy();
    }
  });

  it('should reject non-existing ingredients with 400', async () => {
    try {
      checkIngredientsSpy.mockResolvedValueOnce(false);
      const response = await request(app).post('/').send(validRecipe);
      expect(validateSpy).toHaveBeenCalledTimes(1);
      expect(validateSpy).toHaveBeenCalledWith(validRecipe);
      expect(checkIngredientsSpy).toHaveBeenCalledTimes(1);
      expect(checkIngredientsSpy).toHaveBeenCalledWith(
        validRecipe.ingredients.map(({ id }) => id)
      );
      expect(createSpy).not.toHaveBeenCalled();
      expect(response.status).toEqual(400);
    } catch {
      expect(false).toBeTruthy();
    }
  });

  it('should create a recipe when payload is valid', async () => {
    try {
      const response = await request(app).post('/').send(validRecipe);
      expect(validateSpy).toHaveBeenCalled();
      expect(validateSpy).toHaveReturnedWith(true);
      expect(checkIngredientsSpy).toHaveBeenCalled();
      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(createSpy).toHaveBeenCalledWith(validRecipe);
      expect(response.status).toEqual(201);
      expect(response.body).toMatchObject({ id: 1, ...validRecipe });
    } catch {
      expect(false).toBeTruthy();
    }
  });

  it('should return 500 if anything throws', async () => {
    try {
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
    } catch {
      expect(false).toBeTruthy();
    }
  });
});
