import express from 'express';
import { readAll } from './readAll';
import { create } from './create';

const router = express.Router({ mergeParams: true });

router.get('/', readAll);
router.post('/', create);

export default router;
