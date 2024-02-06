import express from 'express';
import { create } from './create';
import { readAll } from './readAll';

const router = express.Router();

router.post('/', create);
router.get('/', readAll);

export default router;
