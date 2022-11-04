const express = require("express");
const router = express.Router();
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const multer = require('multer');
const auth = require("../auth");
const User = require('../model/user');
const Comment = require('../model/comment');

const mongoURI = "mongodb://mongo:27017/uploads";

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;

conn.once('open', () => {
    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('images');
});



// Create storage engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, async (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = req.body.imageName + path.extname(file.originalname);
                const fileInfo = {
                    id: req.body.imageName,
                    filename: filename,
                    bucketName: 'images',
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });



// @route POST /
// @desc Uploads file to db
router.post('/', auth, upload.single('file'), async (req, res) => {
    res.json({ file: req.file });
});



// @route GET /image/:filename
// @desc Display Image
router.get('/image/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }

        // Check if image
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            // Read output to browser
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        } else {
            res.status(404).json({
                err: 'Not an image'
            });
        }
    });
});
module.exports = router;