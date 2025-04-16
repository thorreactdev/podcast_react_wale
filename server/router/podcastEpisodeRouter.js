import express from 'express';
import {authChecker} from "../middleware/authMiddleware.js"
import { generateSummaryOfTranscription } from '../controller/podcastEpisodeController.js';

const router = express.Router();

router.route("/podcast-summary").post(authChecker , generateSummaryOfTranscription);

export default router;