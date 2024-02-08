import { Knex } from 'knex';

export async function seed(knex: Knex) {
  await knex('ingredients').delete();
  await knex('ingredients').insert([
    {
      id: 1,
      name: 'eggs',
    },
  ]);
}
