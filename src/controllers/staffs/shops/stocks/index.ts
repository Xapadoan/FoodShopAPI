import express from 'express';
import { update } from './update';
import { create } from './create';

const stocksRouter = express.Router({ mergeParams: true });

stocksRouter.put('/:stockId', update);
stocksRouter.post('/', create);

export { stocksRouter };
