import { RecipesRepository } from '../../src/repo/RecipesRepository';
import { Repository } from '../../src/repo/Repository';

describe('Recipes Repository', () => {
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
    const recipe = await repository.create({
      name: 'Boiled eggs',
      numberOfPeople: 4,
      steps: [{ ranking: 1, text: 'I guess you can cook this by yourself' }],
      ingredients: [{ id: 1, quantity: '4' }],
    });
    expect(recipe).toBeTruthy();
    expect(repository.validate(recipe)).toBeTruthy();
  });

  it('should throw when creating a recipe with non-existing ingredients', async () => {
    try {
      await repository.create({
        name: 'Boiled eggs',
        numberOfPeople: 4,
        steps: [{ ranking: 1, text: 'I guess you can cook this by yourself' }],
        ingredients: [{ id: 42, quantity: '4' }],
      });
      expect(false).toBeTruthy();
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });
});
