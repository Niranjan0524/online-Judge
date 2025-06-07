const express = require('express');

const uploadFileRouter = express.Router();

const { uploadFile, deleteFile } = require('../controllers/fileUpload');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

uploadFileRouter.post('/upload', upload.single('file'), uploadFile);
uploadFileRouter.delete('/delete', deleteFile);

module.exports = uploadFileRouter;