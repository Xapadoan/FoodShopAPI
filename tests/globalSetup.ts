import { config } from 'dotenv';
config();

import { initDb } from '../src/data';

export default async function globalSetup() {
  console.log('Start global setup');
  await initDb();
  console.log('Global setup OK');
}
