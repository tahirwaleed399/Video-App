const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const { catchAsyncErrors } = require("../Utils/catchAsyncErrors");
const { jsonResponce } = require("../Utils/responce");
const NewErrorHandler = require("../Utils/NewErrorHandler");
const path = require("path");
const fs = require("fs");
var cloudinary = require('cloudinary');
const thumbsupply = require("thumbsupply");
const Video = require("../Models/Video");
var mime = require('mime');

// console.log(path.dirname())
exports.upload = catchAsyncErrors(async (req, res, next) => {
  const files = req.files;

  let fileNames = [];
  let videos = [];
  // Storing File into files folder
  Object.keys(files).forEach((key) => {
    // naming them as userID,name,fileName.extension
    const fileName = `${Date.now()},${req.user._id},${req.user.name},${
      files[key].name.split(".")[0]
    }${path.extname(files[key].name)}`;

    fileNames.push(fileName);

    const videoPath = path.join(__dirname, "..", "files", fileName);
    // Storing video into folder
    files[key].mv(videoPath, (err) => {
      if (err) return res.status(500).json({ status: "error", message: err });
      // AFter the video is uploaded

      //  If User Will Not Give Thumbnail While Uploading the Video
      // Because I have no Paid Hosting thats why thumbnail part will only work in development mode
      if (process.env.NODE_ENV === "development") {
        thumbsupply
          .generateThumbnail(`files/${fileName}`, {
            size: thumbsupply.ThumbSize.LARGE, // or ThumbSize.LARGE
            timestamp: "10%", // or `30` for 30 seconds
            forceCreate: true,
            cacheDir: "./thumbs",
            mimetype: "video/mp4",
          })
          .then(async (thumb) => {

      
         const {url , public_id} =  await   cloudinary.v2.uploader.upload(thumb, {
              folder : 'VideoApp'
            });
            fs.unlinkSync(thumb);

            // Here We will Create An Video Object When Everything is Ready Thumbnail + Video
            const video = await Video.create({
              name: files[key].name.split(".")[0],
              videoSlug: fileName,
              user: req.user._id,
              thumbnail : {
                url , public_id
              }
            });
            videos.push(video);
          })
          .catch((err) => {
            console.log('some error occurred');
          });
      }
    });
  });

  jsonResponce(res, 201, true, { message: "Videos Have Been Published" });
});


exports.getVideos = catchAsyncErrors(async (req ,res , next)=>{


const videos = await Video.find({user : req.user._id});
jsonResponce(res , 200  , true , videos);
})
exports.download = catchAsyncErrors(async (req ,res , next)=>{


const {id} = req.params;
  console.log(id);
  
const video =await Video.findById(id);

const videoPath = "files/"+video.videoSlug;
const memeType = mime.getType(videoPath);


res.set({
  'Content-Type': memeType
});
res.sendFile(path.join(__dirname, '..', videoPath));
// res.download(videoPath);
})


exports.getVideo = catchAsyncErrors(async (req , res , next)=>{
  const range = req.headers.range;
  console.log(range)
  if (!range) {
      res.status(400).send("Requires Range header");
  }
  const {id} = req.params;
  
  const video =await Video.findById(id);
  const videoPath = "files/"+video.videoSlug;
  const videoSize = fs.statSync(videoPath).size;

  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  const contentLength = end - start + 1;
const headers = {
  "Content-Range": `bytes ${start}-${end}/${videoSize}`,
  "Accept-Ranges": "bytes",
  "Content-Length": contentLength,
  "Content-Type": "video/mp4",
}
console.log(headers);


res.writeHead(206, headers);

const videoStream = fs.createReadStream(videoPath, { start, end });
videoStream.pipe(res);
})