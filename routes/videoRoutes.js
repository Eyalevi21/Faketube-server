import express from 'express';
import { homeVideos , getComments, addComment, getReactions, updateReactions, searchedVideos } from '../controllers/videoController.js';
const router = express.Router();

router.get('/', homeVideos);
router.get('/search', searchedVideos);
router.get('/:vid/comments', getComments);
router.get('/:vid/reactions', getReactions);
router.patch('/:vid/reactions', updateReactions);

router.post('/:vid/comments', addComment);

export default router;