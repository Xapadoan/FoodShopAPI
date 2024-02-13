import knex from '../../src/data';

export const values = [
  {
    id: 1,
    name: 'fries with paprika',
    nb_people: 4,
  },
  {
    id: 2,
    name: 'chilli con carne',
    nb_people: 4,
  },
];

export async function seed() {
  await knex('recipes').delete();
  await knex('recipes').insert(values);
}
