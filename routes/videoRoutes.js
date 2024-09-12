import express from 'express';
import { homeVideos, videoData, updateVideo, deleteVideo } from '../controllers/videoController.js';
const router = express.Router();

router.get('/', homeVideos);
router.get('/:vid', videoData)

router.patch('/:vid', updateVideo);
router.put('/:vid', updateVideo);  
router.delete('/:vid', deleteVideo);
export default router;