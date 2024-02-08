import knex from '../../src/data';

export async function seed() {
  await knex('steps').delete();
  await knex.raw('SET FOREIGN_KEY_CHECKS=0');
  await knex('steps').insert([
    {
      id: 1,
      recipe_id: 1,
      ranking: 1,
      text: 'Cut the potatoes in julienne',
    },
    {
      id: 2,
      recipe_id: 1,
      ranking: 2,
      text: 'Rinse with a lot of water and dry in a clean towel',
    },
    {
      id: 3,
      recipe_id: 1,
      ranking: 3,
      text: 'Preheat the oven to 210 C',
    },
    {
      id: 4,
      recipe_id: 1,
      ranking: 4,
      text: 'In a large bowl, mix the olive oil, salt, pepper and paprika with the freshly cut potatoes',
    },
    {
      id: 5,
      recipe_id: 1,
      ranking: 5,
      text: 'Dispose your fresh fries on a large plate and put it in the oven for 30 minutes',
    },
  ]);
  await knex.raw('SET FOREIGN_KEY_CHECKS=1');
}
