import express from 'express';
import { getUser, updateUser, deleteUser, createUser } from '../controllers/userController.js';
import {videoData, updateVideo, deleteVideo } from '../controllers/videoController.js';
import { getUserVideos } from '../controllers/videoController.js';

const router = express.Router();
router.get('/:id/videos', getUserVideos);
//router.post('/:id/videos', uploadVideo);


router.get('/:id', getUser);
router.patch('/:id', updateUser);
router.put('/:id', updateUser);  
router.delete('/:id', deleteUser);

router.post('/', createUser);


router.get('/:id/videos/:vid', videoData);
router.patch('/:id/videos/:vid', updateVideo);
router.put('/:id/videos/:vid', updateVideo);  
router.delete('/:id/videos/:vid', deleteVideo);


export default router;
