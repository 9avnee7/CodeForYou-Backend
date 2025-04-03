require("dotenv").config();
const express=require('express');
const mongoose=require('mongoose')
const helmet=require('helmet');
const logger=require('./utils/logger');
// const feedbackRoutes=require('./routes/feedback-routes')
const cors=require('cors');
// const loginRoutes=require('./routes/login-routes')
const cookieParser=require('cookie-parser');
const platformRoutes=require('./routes/platform-routes')
mongoose.connect(process.env.MongoDB_URL).then(result=>logger.info('mongodb connected')).catch(e=>console.error('error occured'));

const PORT=process.env.PORT||3003;

const app=express();
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true, 
}));


app.use(cookieParser());
app.use(helmet());

// app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));


app.use((req, res, next) => {
    logger.info(`Received ${req.method} request to ${req.url}`);
    logger.info(`Request body, ${req.body}`);
    next();
  });

app.use('/api/platform',platformRoutes);


app.listen(PORT,()=>{
    console.log('platform service running on port ',PORT);
  })