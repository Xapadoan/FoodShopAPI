import type { Entry } from '@repo/Repository';
import type { Staff } from '@repo/StaffsRepository';
import type { Shop } from '@repo/ShopsRepository';
import type { Ingredient } from '@repo/IngredientsRepository';
import type { Stock } from '@repo/StocksRepository';
import type { Recipe, RecipePreview } from '@repo/RecipesRepository';
import type { Response, Request } from 'express';

export function expectResolved(spy: jest.SpyInstance) {
  return expect(spy.mock.results[0]?.value).resolves;
}

export function expectRejected(spy: jest.SpyInstance) {
  return expect(spy.mock.results[0]?.value).rejects;
}

export function expectNthResolved(spy: jest.SpyInstance, n: number) {
  return expect(spy.mock.results[n - 1]?.value).resolves;
}

export const validStaff: Staff = {
  name: 'Geordy Laforge',
  email: 'geordy@engineering.fed',
};

export const validStaffEntry: Entry<Staff> = {
  ...validStaff,
  id: 1,
};

export const validShop: Shop = {
  name: 'La Cantina',
  address: '5th Federation Avenue NY City',
};

export const validShopEntry: Entry<Shop> = {
  ...validShop,
  id: 1,
};

export const validIngredient: Ingredient = {
  name: 'Carrot',
};

export const validIngredientEntry: Entry<Ingredient> = {
  ...validIngredient,
  id: 1,
};

export const validStock: Stock = {
  ingredientId: validIngredientEntry.id,
  shopId: validShopEntry.id,
  quantity: 24,
  unitPrice: 0.2,
};

export const validStockEntry: Entry<Stock> = {
  ...validStock,
  id: 1,
};

export const validRecipe: Recipe = {
  name: 'Carrot Salad',
  numberOfPeople: 4,
  steps: [
    { text: 'Peel the carrot', ranking: 1 },
    { text: 'Grate them', ranking: 2 },
  ],
  ingredients: [{ id: validIngredientEntry.id, quantity: '2' }],
};

export const validRecipeEntry: Entry<Recipe> = {
  ...validRecipe,
  id: 1,
};

export const validRecipesList: Array<RecipePreview> = [
  {
    id: 1,
    name: 'Carrot Salad',
    numberOfPeople: 4,
  },
  {
    id: 2,
    name: 'Boiled Eggs',
    numberOfPeople: 4,
  },
];

export function routeMock(_: Request, res: Response) {
  return res.json({ success: true });
}
