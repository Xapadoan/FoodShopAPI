import express from 'express';
import recipesRouter from './recipes';
import ingredientsRouter from './ingredients';
import authRouter from './auth';
import staffRouter from './staffs';

const router = express.Router();

router.use('/recipes', recipesRouter);
router.use('/ingredients', ingredientsRouter);
router.use('/auth', authRouter);
router.use('/staffs', staffRouter);
router.use('*', (_, res) => res.status(404).json({ message: 'Not found' }));

export default router;
