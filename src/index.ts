import { config } from 'dotenv';
import express from 'express';

config();
const app = express();

process.once('SIGUSR2', () => process.kill(process.pid, 'SIGUSR2'));
process.once('SIGINT', () => process.kill(process.pid, 'SIGINT'));

app.get('/', (req, res) => {
  res.json({ success: true });
});
app.use('*', (req, res) => res.status(404).json({ message: 'Not found' }));

app.listen(8080, () => console.log('FoodShopAPI is ready on port 8080'));
