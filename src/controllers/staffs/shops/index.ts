import express from 'express';
import { readAll } from './readAll';

const router = express.Router({ mergeParams: true });

router.get('/', readAll);

export default router;
