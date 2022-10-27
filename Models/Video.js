const mongoose = require("mongoose");
const User = require('./User');

const videoSchema = new mongoose.Schema({
  name : {
type : String ,
required: [true, "Name is Required"],

  },
  videoSlug :{
    type :String,
    required : true 
  } ,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
thumbnail : {
  type : {
    public_id : String , 
    url : String ,
  }
}
});
const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
