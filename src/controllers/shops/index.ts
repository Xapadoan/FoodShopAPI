import express from 'express';
import { publicShop } from 'src/controllers/middlewares/publicShop';
import { stocksRouter } from './stocks';
import { read } from './read';

const publicShopsRouter = express.Router({ mergeParams: true });

publicShopsRouter.use('/:shopId', publicShop);
publicShopsRouter.use('/:shopsId/stocks', stocksRouter);
publicShopsRouter.get('/:shopId', read);

export { publicShopsRouter };
