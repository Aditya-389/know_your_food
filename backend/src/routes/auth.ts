import express from 'express';
import { login, register } from '../controller/auth';


const router = express.Router();

router.post('/register',  register);

router.post('/login', login);

// router.post('/refresh-token', );

// router.post('/logout', );

export default router;