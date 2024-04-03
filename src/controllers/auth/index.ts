import express from 'express';
import webhookRouter from './webhook';
import { initRegister } from './initRegister';
import { initLogin } from './initLogin';
import { initReset } from './initReset';
import { endRegister } from './endRegister';
import { endLogin } from './endLogin';
import { endReset } from './endReset';
import { logout } from './logout';

const router = express.Router();

router.post('/register/init', initRegister);
router.post('/login/init', initLogin);
router.post('/reset/init', initReset);
router.post('/register/end', endRegister);
router.post('/login/end', endLogin);
router.post('/reset/end', endReset);
router.delete('/logout', logout);
router.use('/webhook', webhookRouter);

export default router;
