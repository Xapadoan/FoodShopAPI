import knex from '../../src/data';

export async function seed() {
  await knex('recipes').delete();
  await knex('recipes').insert([
    {
      id: 1,
      name: 'fries with paprika',
      nb_people: 4,
    },
  ]);
}
