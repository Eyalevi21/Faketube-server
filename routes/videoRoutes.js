import express from 'express';
import { homeVideos, videoData, updateVideo, deleteVideo } from '../controllers/videoController.js';
const router = express.Router();

router.get('/api/videos', homeVideos);
router.get('/api/videos/:vid', videoData)

router.patch('/api/videos/:vid', updateVideo);
router.put('/api/videos/:vid', updateVideo);  
router.delete('/api/videos/:vid', deleteVideo);
export default router;