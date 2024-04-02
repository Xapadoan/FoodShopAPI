import express from 'express';
import { onRegister } from './register';
import { onLogin } from './login';
import { onResetConfirm } from './resetConfirm';
import { onResetUpload } from './resetUpload';

const router = express.Router();

router.post('/register', onRegister);
router.post('/login', onLogin);
router.post('/reset-confirm', onResetConfirm);
router.post('/reset-credentials', onResetUpload);

export default router;
