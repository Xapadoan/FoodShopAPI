import express from 'express';
import { readAll } from './readAll';
import { create } from './create';
import { checkShopStaffRelation } from 'src/controllers/middlewares/checkShopStaffRelation';
import { stocksRouter } from './stocks';

const router = express.Router({ mergeParams: true });

router.use('/:shopId', checkShopStaffRelation);
router.use('/:shopsId/stocks', stocksRouter);
router.get('/', readAll);
router.post('/', create);

export default router;
