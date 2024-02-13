import express from 'express';
import { create } from './create';
import { readAll } from './readAll';
import { read } from './read';

const router = express.Router();

router.post('/', create);
router.get('/:id', read);
router.get('/', readAll);

export default router;
