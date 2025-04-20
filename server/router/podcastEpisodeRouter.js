import express from 'express';
import {authChecker} from "../middleware/authMiddleware.js"
import { askQuestion, generateSummaryOfTranscription, generateTweets, getMoskedAskedFAQ } from '../controller/podcastEpisodeController.js';

const router = express.Router();

router.route("/podcast-summary").post(authChecker , generateSummaryOfTranscription);
router.route("/ask-question").post(authChecker , askQuestion);
router.route("/most-asked-question/:episodeId").get(authChecker, getMoskedAskedFAQ);
router.route("/get-tweets").post(authChecker , generateTweets);

export default router;