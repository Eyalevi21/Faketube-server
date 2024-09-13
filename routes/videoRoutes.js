import express from 'express';
import { homeVideos } from '../controllers/videoController.js';
const router = express.Router();

router.get('/', homeVideos);

export default router;