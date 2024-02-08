import { config } from 'dotenv';
config();

import knex, { initDb } from '../src/data';

export default async function globalSetup() {
  console.log('Start global setup');
  await initDb();
  await knex.seed.run();
  console.log('Global setup OK');
}
