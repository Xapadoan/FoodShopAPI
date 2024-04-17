import { createTracker, MockClient, Tracker } from 'knex-mock-client';
import Knex from 'knex';
import knex from '../../src/data';

jest.mock('../../src/data', () => Knex({ client: MockClient }));

import { RecipesRepository } from '../../src/repo/RecipesRepository';
import { Repository } from '../../src/repo/Repository';
import { validRecipe, validRecipeEntry, validRecipesList } from '../utils';

describe('Recipes Repository', () => {
  let dbTracker: Tracker;
  beforeAll(() => {
    dbTracker = createTracker(knex);
  });
  afterAll(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });
  afterEach(() => {
    dbTracker.reset();
    jest.clearAllMocks();
  });
  const repository = new RecipesRepository();

  it('should be a repository', () => {
    expect(repository instanceof Repository).toBeTruthy();
  });

  it('should have accurate validation', () => {
    expect(repository.validate('Hello !')).toBeFalsy();
    expect(repository.validate({})).toBeFalsy();
    expect(repository.validate({ name: 'Hello !' })).toBeFalsy();
    expect(
      repository.validate({
        name: 'Hello !',
        numberOfPeople: 23,
      })
    ).toBeFalsy();
    expect(
      repository.validate({
        name: 'Hello !',
        numberOfPeople: 23,
        steps: [{ ranking: 1, text: 'Say hello !' }],
      })
    ).toBeFalsy();
    expect(
      repository.validate({
        name: 'Hello !',
        numberOfPeople: 23,
        steps: [{ ranking: 1, text: 'Say hello !' }],
        ingredients: [{ id: 1, quantity: '3' }],
      })
    ).toBeTruthy();
    expect(
      repository.validate({
        name: 23,
        numberOfPeople: 23,
        steps: [{ ranking: 1, text: 'Say hello !' }],
        ingredients: [{ id: 1, quantity: '3' }],
      })
    ).toBeFalsy();
    expect(
      repository.validate({
        name: 'Hello !',
        numberOfPeople: 'Hello !',
        steps: [{ ranking: 1, text: 'Say hello !' }],
        ingredients: [{ id: 1, quantity: '3' }],
      })
    ).toBeFalsy();
    expect(
      repository.validate({
        name: 'Hello !',
        numberOfPeople: 23,
        steps: 'Hello !',
        ingredients: [{ id: 1, quantity: '3' }],
      })
    ).toBeFalsy();
    expect(
      repository.validate({
        name: 'Hello !',
        numberOfPeople: 23,
        steps: {},
        ingredients: [{ id: 1, quantity: '3' }],
      })
    ).toBeFalsy();
    expect(
      repository.validate({
        name: 'Hello !',
        numberOfPeople: 23,
        steps: [],
        ingredients: [{ id: 1, quantity: '3' }],
      })
    ).toBeFalsy();
    expect(
      repository.validate({
        name: 'Hello !',
        numberOfPeople: 23,
        steps: ['Hello !'],
        ingredients: [{ id: 1, quantity: '3' }],
      })
    ).toBeFalsy();
    expect(
      repository.validate({
        name: 'Hello !',
        numberOfPeople: 23,
        steps: [{ ranking: 1 }],
        ingredients: [{ id: 1, quantity: '3' }],
      })
    ).toBeFalsy();
    expect(
      repository.validate({
        name: 'Hello !',
        numberOfPeople: 23,
        steps: [{ ranking: 'Hello !', text: 'Say hello !' }],
        ingredients: [{ id: 1, quantity: '3' }],
      })
    ).toBeFalsy();
    expect(
      repository.validate({
        name: 'Hello !',
        numberOfPeople: 23,
        steps: [{ ranking: 1, text: 23 }],
        ingredients: [{ id: 1, quantity: '3' }],
      })
    ).toBeFalsy();
    expect(
      repository.validate({
        name: 'Hello !',
        numberOfPeople: 23,
        steps: [{ ranking: 1, text: 'Say hello !' }],
        ingredients: 'Hello !',
      })
    ).toBeFalsy();
    expect(
      repository.validate({
        name: 'Hello !',
        numberOfPeople: 23,
        steps: [{ ranking: 1, text: 'Say hello !' }],
        ingredients: [],
      })
    ).toBeFalsy();
    expect(
      repository.validate({
        name: 'Hello !',
        numberOfPeople: 23,
        steps: [{ ranking: 1, text: 'Say hello !' }],
        ingredients: ['Hello !'],
      })
    ).toBeFalsy();
    expect(
      repository.validate({
        name: 'Hello !',
        numberOfPeople: 23,
        steps: [{ ranking: 1, text: 'Say hello !' }],
        ingredients: [{ id: 1 }],
      })
    ).toBeFalsy();
    expect(
      repository.validate({
        name: 'Hello !',
        numberOfPeople: 23,
        steps: [{ ranking: 1, text: 'Say hello !' }],
        ingredients: [{ id: 1, quantity: 3 }],
      })
    ).toBeFalsy();
    expect(
      repository.validate({
        name: 'Hello !',
        numberOfPeople: 23,
        steps: [{ ranking: 1, text: 'Say hello !' }],
        ingredients: [{ id: 'Hello !', quantity: '3' }],
      })
    ).toBeFalsy();
  });

  it('should be able to create a recipe with existing ingredients', async () => {
    dbTracker.on.insert('recipes').response([validRecipeEntry.id]);
    dbTracker.on.insert('steps').response([1]);
    dbTracker.on.insert('recipes_ingredients').response([1]);
    const recipe = await repository.create(validRecipe);
    expect(recipe).toMatchObject(validRecipeEntry);

    const insertHistory = dbTracker.history.insert;
    expect(insertHistory.length).toEqual(3);

    const insertRecipe = insertHistory.find((insert) =>
      insert.sql.includes('recipes')
    );
    expect(insertRecipe).not.toBeUndefined();
    expect(insertRecipe?.method).toEqual('insert');
    expect(insertRecipe?.bindings).toContainEqual(validRecipe.name);
    expect(insertRecipe?.bindings).toContainEqual(validRecipe.numberOfPeople);

    const insertSteps = insertHistory.find((insert) =>
      insert.sql.includes('steps')
    );
    expect(insertSteps).not.toBeUndefined();
    expect(insertSteps?.method).toEqual('insert');
    validRecipe.steps.forEach((step) => {
      expect(insertSteps?.bindings).toContainEqual(step.ranking);
      expect(insertSteps?.bindings).toContainEqual(step.text);
    });

    const insertIngredients = insertHistory.find((insert) =>
      insert.sql.includes('recipes_ingredients')
    );
    expect(insertIngredients).not.toBeUndefined();
    expect(insertIngredients?.method).toEqual('insert');
    validRecipe.ingredients.forEach((ingredient) => {
      expect(insertIngredients?.bindings).toContainEqual(ingredient.id);
      expect(insertIngredients?.bindings).toContainEqual(ingredient.quantity);
    });
  });

  it('should throw when creating a recipe with non-existing ingredients', async () => {
    dbTracker.on
      .insert('recipes_ingredients')
      .simulateErrorOnce('Invalid Reference');
    try {
      await repository.create({
        ...validRecipe,
        ingredients: [{ id: 42, quantity: '42' }],
      });
      expect(false).toBeTruthy();
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('should be able to list recipes with name filter', async () => {
    dbTracker.on.select('recipes').response(validRecipesList);
    const list = await repository.list({ name: 'salad' }, 0);
    expect(list).toMatchObject(validRecipesList);

    const selectHistory = dbTracker.history.select;
    expect(selectHistory.length).toEqual(1);
    expect(selectHistory[0].method).toEqual('select');
    expect(selectHistory[0].bindings).toContainEqual('%salad%');
    expect(selectHistory[0].sql.toLowerCase()).toContain('like');
  });

  it('should return falsy result when trying to read a non-existing recipe', async () => {
    dbTracker.on.select('recipes').response(undefined);
    dbTracker.on.select('steps').response(undefined);
    dbTracker.on.select('recipes_ingredients').response(undefined);
    const recipe = await repository.read({ id: 42 });
    expect(recipe).toBeUndefined();
  });

  it('should be able to read an existing recipe by id', async () => {
    dbTracker.on.select('recipes').response({
      id: validRecipeEntry.id,
      name: validRecipeEntry.name,
      numberOfPeople: validRecipeEntry.numberOfPeople,
    });
    dbTracker.on.select('steps').response(validRecipeEntry.steps);
    dbTracker.on
      .select('recipes_ingredients')
      .response(validRecipeEntry.ingredients);
    const recipe = await repository.read({ id: validRecipeEntry.id });
    expect(recipe).not.toBeUndefined();
    expect(recipe?.id).toEqual(validRecipeEntry.id);
    expect(recipe?.name).toEqual(validRecipeEntry.name);
    expect(recipe?.numberOfPeople).toEqual(validRecipeEntry.numberOfPeople);

    const selectHistory = dbTracker.history.select;
    expect(selectHistory.length).toEqual(3);

    const selectRecipe = selectHistory.find((select) =>
      select.sql.toLowerCase().includes('recipes')
    );
    expect(selectRecipe).not.toBeUndefined();
    expect(selectRecipe?.method).toEqual('select');
    expect(selectRecipe?.bindings).toContainEqual(validRecipeEntry.id);

    const stepsSelect = selectHistory.find((select) =>
      select.sql.toLowerCase().includes('steps')
    );
    expect(stepsSelect).not.toBeUndefined();
    expect(stepsSelect?.method).toEqual('select');
    expect(stepsSelect?.bindings).toContainEqual(validRecipeEntry.id);

    const ingredientsSelect = selectHistory.find((select) =>
      select.sql.toLowerCase().includes('recipes_ingredients')
    );
    expect(ingredientsSelect).not.toBeUndefined();
    expect(ingredientsSelect?.method).toEqual('select');
    expect(ingredientsSelect?.bindings).toContainEqual(validRecipeEntry.id);
  });
});
