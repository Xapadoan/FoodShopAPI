import express from 'express';
import recipesRouter from './recipes';
import ingredientRouter from './ingredients';

const router = express.Router();

router.use('/recipes', recipesRouter);
router.use('/ingredients', ingredientRouter);
router.get('/', (_, res) => res.json({ s: 'OK' }));
router.use('*', (req, res) => res.status(404).json({ message: 'Not found' }));

export default router;
