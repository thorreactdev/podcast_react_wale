import express from 'express';
import multer from "multer";
import {
    checkUserCredit,
    createPodcast,
    getAllPodcast, getAllPodcastDiscoverWithSearchFilter, getLatestPodcast, getPopularPodcast, getSimilarPodcast,
    getSinglePodcast,
    getTopPodcaster,
    singleUserPodcast,
    userEditPodcast
} from "../controller/podcastController.js";
import {
    generateAudioFromElevenLabs,
    generateImageFromClickDrop,
    uploadCustomImage
} from "../controller/audioGeneratingController.js";
import { authChecker } from '../middleware/authMiddleware.js';
const router = express.Router();

export const upload = multer({ dest : "uploads/"})

router.route("/create-podcast").post(authChecker,createPodcast);
router.route("/generate-audio").post(authChecker,generateAudioFromElevenLabs);
router.route("/generate-image").post(authChecker,generateImageFromClickDrop);
router.route("/upload-custom-image").post(authChecker,upload.single("file"), uploadCustomImage);
router.route("/get-all-podcast").get(getAllPodcast);
router.route("/edit-podcast/:podcastID/:userID").put(userEditPodcast);
router.route("/get-user-podcast/:userId").get(singleUserPodcast);
router.route("/get-single-podcast/:podcastID").get(getSinglePodcast);
router.route("/get-similar-podcast/:podcastId").get(getSimilarPodcast);
router.route("/get-top-podcast").get(getTopPodcaster);
router.route("/get-discover-podcast").get(getAllPodcastDiscoverWithSearchFilter);
router.route("/get-latest-podcast").get(getLatestPodcast);
router.route("/get-popular-podcast").get(getPopularPodcast);
router.route("/check-credits").get(authChecker, checkUserCredit);

export default router;