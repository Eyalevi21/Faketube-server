import express from 'express';
import { getUser, updateUser, deleteUser, createUser, uploadProfileImage } from '../controllers/userController.js';
import {videoData, updateVideo, deleteVideo } from '../controllers/videoController.js';
import { getUserVideos } from '../controllers/videoController.js';
import multer from 'multer';



const upload = multer({ dest: 'public/uploads/' });
const router = express.Router();


router.post('/', createUser);
router.post('/:id/upload-profile', upload.single('profileImage'), uploadProfileImage);








router.get('/:id/videos', getUserVideos);
//router.post('/:id/videos', uploadVideo);

router.get('/:id', getUser);
router.patch('/:id', updateUser);
router.put('/:id', updateUser);  
router.delete('/:id', deleteUser);

router.get('/:id/videos/:vid', videoData);
router.patch('/:id/videos/:vid', updateVideo);
router.put('/:id/videos/:vid', updateVideo);  
router.delete('/:id/videos/:vid', deleteVideo);


export default router;
