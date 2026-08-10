import express from 'express';
import { login, refresh, register } from '../controller/auth';


const router = express.Router();

router.post('/register',  register);

router.post('/login', login);

router.post('/refresh-token', refresh);

// router.post('/logout', );

export default router;