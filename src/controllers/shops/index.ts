import express from 'express';
import { publicShop } from 'src/controllers/middlewares/publicShop';
import { stocksRouter } from './stocks';
import { read } from './read';

const publicShopRouter = express.Router({ mergeParams: true });

publicShopRouter.use('/:shopId', publicShop);
publicShopRouter.use('/:shopsId/stocks', stocksRouter);
publicShopRouter.get('/:shopId', read);

export { publicShopRouter };
