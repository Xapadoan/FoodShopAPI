import knex from '../src/data';

async function clearData() {
  await Promise.allSettled([
    knex('steps').delete(),
    knex('recipes_ingredients').delete(),
  ]);
  await Promise.allSettled([knex('ingredients').delete(), knex('recipes')]);
}

export default async function globalTeardown() {
  console.log('Start global teardown');
  await clearData();
  console.log('Global teardown OK');
  await knex.destroy();
}
