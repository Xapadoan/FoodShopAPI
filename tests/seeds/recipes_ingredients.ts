import knex from '../../src/data';

export async function seed() {
  await knex('recipes_ingredients').delete();
  await knex.raw('SET FOREIGN_KEY_CHECKS=0');
  await knex('recipes_ingredients').insert([
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
  ]);
  await knex.raw('SET FOREIGN_KEY_CHECKS=1');
}
