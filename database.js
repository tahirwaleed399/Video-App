const mongoose = require("mongoose");
const NewErrorHandler = require("./Utils/NewErrorHandler");
console.log(process.env.DATABASE_URL);

exports.connectMongoDb = function(){
  console.log( process.env.DATABASE_URL)
    mongoose.connect(
        process.env.DATABASE_URL,
        { 
          dbName: "VideoSharingApp",
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
        (err) =>
         { 
          if(!err) console.log('Connected to database ' + process.env.DATABASE_URL);
       
          console.log(err);
          
          if(err) throw new NewErrorHandler('Database not connected' , 500)
         }
      );
      
}