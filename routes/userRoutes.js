import express from 'express';
import { getUser, updateUser, deleteUser } from '../controllers/userController.js';
import { getUserVideos } from '../controllers/videoController.js';

const router = express.Router();
router.get('/api/users/:id/videos', getUserVideos);
router.get('/api/users/:id', getUser);


router.patch('/api/users/:id', updateUser);
router.put('/api/users/:id', updateUser);  

router.delete('/api/users/:id', deleteUser);

export default router;
