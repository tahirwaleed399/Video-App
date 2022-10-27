let express = require("express");
const videoController = require("../Controllers/videoController");
const authController = require("../Controllers/authController");
const fileUpload = require("express-fileupload");
const fileSizeLimmiter = require('../Middlewares/fileSizeLimmiter');
const fileExtLimmiter = require('../Middlewares/fileExtLimmiter');
const filesPayloadExists = require('../Middlewares/filePayloadExists');

let router = express.Router();

router.post(
    "/upload-video",
  
    fileUpload({ createParentPath: true }),
    authController.protectRoute,
    filesPayloadExists,
    fileExtLimmiter([".mp4", ".mkv"]),
    fileSizeLimmiter,
    videoController.upload
);

router.get("/get-videos", authController.protectRoute , videoController.getVideos);
router.get("/get-video/:id",  videoController.getVideo);
router.get("/download/:id",  videoController.download);

module.exports = router;
