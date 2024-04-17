import { createTracker, MockClient, Tracker } from 'knex-mock-client';
import Knex from 'knex';
import knex from '../../src/data';

jest.mock('../../src/data', () => Knex({ client: MockClient }));

import { IngredientsRepository } from '../../src/repo/IngredientsRepository';
import { Repository } from '../../src/repo/Repository';
import { validIngredient, validIngredientEntry } from '../utils';

describe('Ingredients Repository', () => {
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

  const repository = new IngredientsRepository();

  it('should be a repository', () => {
    expect(repository instanceof Repository).toBeTruthy();
  });

  it('should have accurate validation', () => {
    expect(repository.validate('Hello !')).toBeFalsy();
    expect(repository.validate({})).toBeFalsy();
    expect(repository.validate({ name: 'Hello' })).toBeTruthy();
    expect(repository.validate({ name: 89 })).toBeFalsy();
  });

  it('should be able to read an existing ingredient by name', async () => {
    dbTracker.on.select('ingredients').response(validIngredientEntry);
    const ingredient = await repository.read({ name: validIngredient.name });
    expect(ingredient).toMatchObject(validIngredientEntry);

    const selectHistory = dbTracker.history.select;
    expect(selectHistory.length).toEqual(1);
    expect(selectHistory[0].method).toEqual('select');
    expect(selectHistory[0].bindings).toContainEqual(validIngredient.name);
  });

  it('should be able to read an existing ingredient by id', async () => {
    dbTracker.on.select('ingredients').response(validIngredientEntry);
    const ingredient = await repository.read({ id: validIngredientEntry.id });
    expect(ingredient).toMatchObject(validIngredientEntry);

    const selectHistory = dbTracker.history.select;
    expect(selectHistory.length).toEqual(1);
    expect(selectHistory[0].method).toEqual('select');
    expect(selectHistory[0].bindings).toContainEqual(validIngredientEntry.id);
  });

  it('should return undefined if no search is provided', async () => {
    const ingredient = await repository.read({});
    expect(ingredient).toBeUndefined();

    const selectHistory = dbTracker.history.select;
    expect(selectHistory.length).toEqual(0);
  });

  it('should return falsy when reading an undefined ingredient', async () => {
    dbTracker.on.select('ingredients').response(undefined);
    const ingredient = await repository.read({ name: validIngredient.name });
    expect(ingredient).toBeUndefined();

    const selectHistory = dbTracker.history.select;
    expect(selectHistory.length).toEqual(1);
    expect(selectHistory[0].method).toEqual('select');
    expect(selectHistory[0].bindings).toContainEqual(validIngredient.name);
  });

  it('should be able to create an ingredient', async () => {
    dbTracker.on.select('ingredients').response(undefined);
    dbTracker.on.insert('ingredients').response([validIngredientEntry.id]);
    const ingredient = await repository.create(validIngredient);
    expect(ingredient).toMatchObject(validIngredientEntry);

    const selectHistory = dbTracker.history.select;
    expect(selectHistory.length).toEqual(1);
    expect(selectHistory[0].method).toEqual('select');
    expect(selectHistory[0].bindings).toContainEqual(validIngredient.name);

    const insertHistory = dbTracker.history.insert;
    expect(insertHistory.length).toEqual(1);
    expect(insertHistory[0].method).toEqual('insert');
    expect(insertHistory[0].bindings).toContainEqual(validIngredient.name);
  });

  it('should not create duplicates', async () => {
    dbTracker.on.select('ingredients').response(validIngredientEntry);
    const ingredient = await repository.create(validIngredient);
    expect(ingredient).toMatchObject(ingredient);

    const selectHistory = dbTracker.history.select;
    expect(selectHistory.length).toEqual(1);
    expect(selectHistory[0].method).toEqual('select');
    expect(selectHistory[0].bindings).toContainEqual(validIngredient.name);

    const insertHistory = dbTracker.history.insert;
    expect(insertHistory.length).toEqual(0);
  });

  it('should be able to list existing ingredients with name filter', async () => {
    dbTracker.on.select('ingredients').response([validIngredientEntry]);
    const ingredients = await repository.list({ name: 'qwe' }, 0);
    expect(ingredients).toEqual([validIngredientEntry]);

    const selectHistory = dbTracker.history.select;
    expect(selectHistory.length).toEqual(1);
    expect(selectHistory[0].method).toEqual('select');
    expect(selectHistory[0].bindings).toContainEqual(`%qwe%`);
    expect(selectHistory[0].sql.toLowerCase()).toContain('like');
  });

  it('should be able to check for ingredients existence', async () => {
    dbTracker.on.select('ingredients').responseOnce([1, 2]);
    dbTracker.on.select('ingredients').responseOnce([1, 2, 3]);
    const check1 = await repository.checkExistence([1, 2, 3]);
    expect(check1).toBeFalsy();
    const check2 = await repository.checkExistence([1, 2, 3]);
    expect(check2).toBeTruthy();

    const selectHistory = dbTracker.history.select;
    expect(selectHistory.length).toEqual(2);
    expect(selectHistory[0].method).toEqual('select');
    expect(selectHistory[0].bindings).toContainEqual(1);
    expect(selectHistory[0].bindings).toContainEqual(2);
    expect(selectHistory[0].bindings).toContainEqual(3);

    expect(selectHistory[1].method).toEqual('select');
    expect(selectHistory[1].bindings).toContainEqual(1);
    expect(selectHistory[1].bindings).toContainEqual(2);
    expect(selectHistory[1].bindings).toContainEqual(3);
  });
});
