import express from 'express';
import { getUser, updateUser, deleteUser, createUser, uploadProfileImage, uploadVideoFile } from '../controllers/userController.js';
import {videoData, updateVideo, deleteVideo } from '../controllers/videoController.js';
import { getUserVideos } from '../controllers/videoController.js';
import multer from 'multer';

const router = express.Router();

const uploadProfilepicture = multer({ dest: 'public/profileImages/' });
const uploadVideo = multer({dest: 'public/videofiles'})
const uploadThumbnail = multer({ dest: 'public/videoThumbnails/' });

router.post('/:id/videos/thumbnail', uploadThumbnail.single('file'),async (req, res) => {
    console.log(req.file);
    console.log(req.file.filename)  // This logs after the file is completely uploaded by Multer
    if (req.file) {
        console.log(req.file);  // Logs the file data that Multer saved
        // Send a JSON response with status 200 and include the filename
        res.status(200).json({
            status: "success",
            message: "File uploaded successfully",
            imageName: req.file.filename  // Include the filename in the response
        });
    } else {
        // If no file was uploaded, send an appropriate response
        res.status(400).json({
            status: "failure",
            message: "No file uploaded"
        });
    }
});
router.post('/:id/videos', uploadVideo.single('file'),async (req, res) => {
    console.log(req.file);  // This logs after the file is completely uploaded by Multer
    try {
        const result = await uploadVideoFile(req,res);
        return result  // Properly ends the response cycle with a 200 OK status
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to process video" });  // Sends an error message and ends the response
    }
});


router.post('/', createUser);
router.post('/:id/upload-profile', uploadProfilepicture.single('profileImage'), uploadProfileImage);

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
