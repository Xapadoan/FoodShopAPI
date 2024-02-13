import { Knex } from 'knex';

export const values = [
  {
    id: 1,
    name: 'eggs',
  },
  {
    id: 2,
    name: 'potatoes',
  },
  {
    id: 3,
    name: 'olive oil',
  },
  {
    id: 4,
    name: 'salt',
  },
  {
    id: 5,
    name: 'paprika',
  },
  {
    id: 6,
    name: 'pepper',
  },
  {
    id: 7,
    name: 'water',
  },
  {
    id: 8,
    name: 'ground beef',
  },
  {
    id: 9,
    name: 'crushed tomatoes',
  },
  {
    id: 10,
    name: 'raz el hanout',
  },
  {
    id: 11,
    name: 'yellow curry powder',
  },
  {
    id: 12,
    name: 'red kidney beans',
  },
  {
    id: 13,
    name: 'yellow onion',
  },
  {
    id: 14,
    name: 'cinnamon',
  },
  {
    id: 15,
    name: 'chilli sauce',
  },
  {
    id: 16,
    name: 'garlic cloves',
  },
];

export async function seed(knex: Knex) {
  await knex('ingredients').delete();
  await knex('ingredients').insert(values);
}
