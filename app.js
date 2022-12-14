const express = require('express');
const app = express();
const userRouter =  require('./Routes/user.js');
const authRouter =  require('./Routes/auth.js');
const videoRouter =  require('./Routes/video.js');
const { jsonResponce } = require('./Utils/responce.js');
const NewErrorHandler = require('./Utils/NewErrorHandler');
const { ErrorController } = require('./Controllers/ErrorController.js');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const path = require('path');
const cookieParser = require("cookie-parser");
var cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const limiter = rateLimit({
    max:100, 
    windowMs : 60 *60 *1000,
    message : 'Too many request from the same IP please try in an hour',
})
const corsOptions = {
  origin: ['http://localhost:3000'],
    
    credentials: true,
  }
 
app.use(cors(corsOptions))
app.use(helmet({
  crossOriginResourcePolicy: false,
}))
app.use(cookieParser());
app.use(limiter)
app.use(express.json());
app.use(mongoSanitize())
app.use(xss());

// We use it because while dealing with api features ig i do a query like this &sort=price&sort=ratings then it will make sort array instead of string this package will prevent that
// app.use(hpp({
//     whitelist : [
//         we can whitelist the properties we dont want to happen that 
//     ]
// }));
app.use(hpp());
app.use(express.static(path.resolve("./public")));
app.use(userRouter);
app.use(authRouter);
app.use(videoRouter);
app.all('*', (req, res , next)=>next(new NewErrorHandler('Route Not Found' , 404)))
app.use(ErrorController)


module.exports = app ;