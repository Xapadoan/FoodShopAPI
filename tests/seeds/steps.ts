import knex from '../../src/data';

export const values = [
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
  {
    id: 6,
    recipe_id: 2,
    ranking: 1,
    text: 'Cut the onion in squares',
  },
  {
    id: 7,
    recipe_id: 2,
    ranking: 2,
    text: 'In a large cooking pot, start cooking the onion with oil at low heat',
  },
  {
    id: 8,
    recipe_id: 2,
    ranking: 3,
    text: 'Once the onion starts getting translucent, add the beef and spices',
  },
  {
    id: 9,
    recipe_id: 2,
    ranking: 4,
    text: 'Gently mix with a spatula until all the beef is cooked',
  },
  {
    id: 10,
    recipe_id: 2,
    ranking: 5,
    text: 'Add the crushed tomatoes, the beans and chilli sauce',
  },
  {
    id: 11,
    recipe_id: 2,
    ranking: 6,
    text: 'Let cook for 1 hour, still at low heat',
  },
  {
    id: 12,
    recipe_id: 2,
    ranking: 7,
    text: 'Crush the garlic and add it into the pot',
  },
];

export async function seed() {
  await knex('steps').delete();
  await knex.raw('SET FOREIGN_KEY_CHECKS=0');
  await knex('steps').insert(values);
  await knex.raw('SET FOREIGN_KEY_CHECKS=1');
}
