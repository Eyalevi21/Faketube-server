import express from 'express';
import { homevideoview } from '../controllers/homevideos.js';
const router = express.Router();

router.get('/api/videos', homevideoview);


export default router;
