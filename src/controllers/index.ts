import express from 'express';
import recipesRouter from './recipes';
import ingredientsRouter from './ingredients';
import shopsRouter from './shops';

const router = express.Router();

router.use('/recipes', recipesRouter);
router.use('/ingredients', ingredientsRouter);
router.use('/shopsRouter', shopsRouter);
router.use('*', (_, res) => res.status(404).json({ message: 'Not found' }));

export default router;
