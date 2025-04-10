import express from 'express';
import { authChecker } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route("/protected").get(authChecker);

export default router