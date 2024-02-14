import knex from '../../src/data';

export const values = [
  {
    id: 1,
    name: 'Fruits and Vegetables',
    address: '42 bridge avenue 94210 Gotham',
  },
];

export async function seed() {
  await knex('shops').delete();
  await knex('shops').insert(values);
}
