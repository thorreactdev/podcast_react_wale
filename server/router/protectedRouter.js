import express from 'express';
import { authChecker } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route("/protected").get(authChecker , (req, res)=>{res.status(200).json({success : true , message : "Protected Route"})});

export default router