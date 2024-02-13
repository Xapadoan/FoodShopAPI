import knex from '../../src/data';

export const values = [
  {
    id: 1,
    recipe_id: 1,
    ingredient_id: 2,
    quantity: '4',
  },
  {
    id: 2,
    recipe_id: 1,
    ingredient_id: 3,
    quantity: '8 tablespoons',
  },
  {
    id: 3,
    recipe_id: 1,
    ingredient_id: 4,
    quantity: '1 tablespoon',
  },
  {
    id: 4,
    recipe_id: 1,
    ingredient_id: 5,
    quantity: '1 tablespoon',
  },
  {
    id: 5,
    recipe_id: 1,
    ingredient_id: 6,
    quantity: '2 pinches',
  },
  {
    id: 6,
    recipe_id: 2,
    ingredient_id: 13,
    quantity: '1 large',
  },
  {
    id: 7,
    recipe_id: 2,
    ingredient_id: 3,
    quantity: '1 tablespoon',
  },
  {
    id: 8,
    recipe_id: 2,
    ingredient_id: 8,
    quantity: '500g',
  },
  {
    id: 9,
    recipe_id: 2,
    ingredient_id: 10,
    quantity: '1 tablespoon',
  },
  {
    id: 10,
    recipe_id: 2,
    ingredient_id: 11,
    quantity: '1 tablespoon',
  },
  {
    id: 11,
    recipe_id: 2,
    ingredient_id: 14,
    quantity: '1 tablespoon',
  },
  {
    id: 12,
    recipe_id: 2,
    ingredient_id: 9,
    quantity: '1.2kg',
  },
  {
    id: 13,
    recipe_id: 2,
    ingredient_id: 12,
    quantity: '700g',
  },
  {
    id: 15,
    recipe_id: 2,
    ingredient_id: 9,
    quantity: '1 tablespoon',
  },
  {
    id: 16,
    recipe_id: 2,
    ingredient_id: 16,
    quantity: '2',
  },
];

export async function seed() {
  await knex('recipes_ingredients').delete();
  await knex.raw('SET FOREIGN_KEY_CHECKS=0');
  await knex('recipes_ingredients').insert(values);
  await knex.raw('SET FOREIGN_KEY_CHECKS=1');
}
