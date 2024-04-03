import express from 'express';
import { me } from './me';
import { staffAuthMiddleware } from '../middlewares/auth';
import staffShopsRouter from './shops';

const router = express.Router({ mergeParams: true });

router.use(staffAuthMiddleware);
router.use('/shops', staffShopsRouter);
router.get('/me', me);

export default router;
