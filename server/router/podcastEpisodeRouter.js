import express from 'express';
import {authChecker} from "../middleware/authMiddleware.js"
import { askQuestion, generateSummaryOfTranscription, getMoskedAskedFAQ } from '../controller/podcastEpisodeController.js';

const router = express.Router();

router.route("/podcast-summary").post(authChecker , generateSummaryOfTranscription);
router.route("/ask-question").post(authChecker , askQuestion);
router.route("/most-asked-question/:episodeId").get(authChecker, getMoskedAskedFAQ);

export default router;