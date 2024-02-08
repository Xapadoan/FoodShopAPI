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
];

export async function seed(knex: Knex) {
  await knex('ingredients').delete();
  await knex('ingredients').insert(values);
}
