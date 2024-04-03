import { config } from 'dotenv';
config();
import express from 'express';
import cors from 'cors';
import router from './controllers';
import { initDb } from './data';
import './moduleAugmentations/express';

process.once('SIGUSR2', () => process.kill(process.pid, 'SIGUSR2'));
process.once('SIGINT', () => process.kill(process.pid, 'SIGINT'));

async function initServer() {
  await initDb();
  const app = express();
  app.use(express.json({ type: 'application/json' }));
  app.use(cors({ origin: '*' }));
  app.use('/', router);
  app.listen(8081, () => console.log('FoodShopAPI is ready on port 8081'));
}

initServer();
