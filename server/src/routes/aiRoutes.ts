import express from 'express';
import { chatWithChef } from '../controllers/aiController';

const router = express.Router();

router.post('/chat', chatWithChef);

export default router;
