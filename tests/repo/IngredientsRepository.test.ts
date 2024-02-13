import knex from '../../src/data';
import {
  Ingredient,
  IngredientsRepository,
} from '../../src/repo/IngredientsRepository';
import { Entry, Repository } from '../../src/repo/Repository';
import { values as allIngredients } from '../seeds/ingredients';

describe('Ingredients Repository', () => {
  beforeAll(async () => {
    await knex.seed.run();
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
    const ingredient = await repository.read({ name: allIngredients[0].name });
    expect(ingredient).toBeTruthy();
    expect(ingredient).toMatchObject(allIngredients[0]);
  });

  it('should be able to read an existing ingredient by id', async () => {
    const ingredient = await repository.read({ id: allIngredients[0].id });
    expect(ingredient).toBeTruthy();
    expect(ingredient).toMatchObject(allIngredients[0]);
  });

  it('should return undefined if no search is provided', async () => {
    const ingredient = await repository.read({});
    expect(ingredient).toBeUndefined();
  });

  it('should return falsy when reading an undefined ingredient', async () => {
    const ingredient = await repository.read({ name: 'spinach' });
    expect(ingredient).toBeFalsy();
  });

  it('should return an ingredient entry after creation', async () => {
    const ingredient = await repository.create({ name: 'milk' });
    expect(repository.validate(ingredient)).toBeTruthy();
    expect(typeof ingredient.id).toBe('number');
  });

  it('should be able to read an ingredient after creation', async () => {
    const ingredient = await repository.read({ name: 'milk' });
    expect(ingredient).toBeTruthy();
  });

  let ingredients: Entry<Ingredient>[] = [];
  it('should be able to list existing ingredients', async () => {
    ingredients = await repository.list({ name: '', page: 0 });
    expect(Array.isArray(ingredients)).toBeTruthy();
    expect(ingredients.length).toEqual(allIngredients.length + 1);
  });

  it('should be able to filter on name when listing', async () => {
    const filteredList = await repository.list({ name: 'eg', page: 0 });
    expect(filteredList.length).toEqual(1);
    expect(filteredList[0].name).toEqual('eggs');
  });

  it('should not create ingredients if one with the same name already exists', async () => {
    await repository.create({ name: 'milk' });
    const list = await repository.list({ name: 'milk', page: 0 });
    expect(list.length).toEqual(1);
  });

  it('should NEVER create duplicates', async () => {
    await Promise.all([
      repository.create({ name: 'milk' }),
      repository.create({ name: 'milk' }),
      repository.create({ name: 'milk' }),
      repository.create({ name: 'milk' }),
      repository.create({ name: 'milk' }),
    ]);
    const list = await repository.list({ name: 'milk', page: 0 });
    expect(list.length).toEqual(1);
  });

  it('should be able to check for ingredients existence', async () => {
    expect(await repository.checkExistence([1, 2, 3])).toBeTruthy();
    expect(await repository.checkExistence([1, 2, 42])).toBeFalsy();
  });
});
