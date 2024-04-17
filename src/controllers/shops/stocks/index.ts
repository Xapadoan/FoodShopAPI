import express from 'express';
import { readAll } from './readAll';

const stocksRouter = express.Router({ mergeParams: true });

stocksRouter.get('/', readAll);

export { stocksRouter };
