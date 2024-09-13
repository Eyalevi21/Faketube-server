import express from 'express';
import { homeVideos , getComments, addComment } from '../controllers/videoController.js';
const router = express.Router();

router.get('/', homeVideos);
router.get('/:vid/comments', getComments);

router.post('/:vid/comments', addComment);

export default router;