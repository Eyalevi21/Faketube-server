import express from 'express';
import { getUser, updateUser, deleteUser, createUser } from '../controllers/userController.js';
import { getUserVideos } from '../controllers/videoController.js';

const router = express.Router();
router.get('/:id/videos', getUserVideos);
router.get('/:id', getUser);


router.patch('/:id', updateUser);
router.put('/:id', updateUser);  

router.delete('/:id', deleteUser);

router.post('/', createUser);

export default router;
