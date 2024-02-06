import { config } from 'dotenv';
config();
import express from 'express';
import router from './controllers';
import { initDb } from './data';

process.once('SIGUSR2', () => process.kill(process.pid, 'SIGUSR2'));
process.once('SIGINT', () => process.kill(process.pid, 'SIGINT'));

async function initServer() {
  await initDb();
  const app = express();
  app.use(express.json({ type: 'application/json' }));
  app.use('/', router);
  app.listen(8080, () => console.log('FoodShopAPI is ready on port 8080'));
}

initServer();
