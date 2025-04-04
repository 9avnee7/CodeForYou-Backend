require('dotenv').config();
const express=require('express');
// const mongoose=require('mongoose');
const logger=require('./utils/logger');
const cors=require('cors');
const helmet=require('helmet');
// const {RateLimiterRedis}=require('rate-limiter-flexible');
const {rateLimit}=require('express-rate-limit');
// const errorHandler=require('./middleware/errorHandler');
<<<<<<< HEAD
// // const routes=require('./routes/identify-routes')
=======
// const routes=require('./routes/identify-routes')
>>>>>>> c7f32dc (modification for redis)
// const redis=require('ioredis');

// const {RedisStore} = require('rate-limit-redis');
const proxy=require('express-http-proxy');
const fetch= require('node-fetch');
const stringRoutes=require('./routes/routes')
const mongoose=require('mongoose');
const puppeteer=require('puppeteer')
// const {validateToken} = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;


mongoose.connect(process.env.MongoDB_URL).then(result=>logger.info("mongo db connected")).catch(e=>console.log("error occured"));



app.use(cors());
app.use(helmet());
app.use(express.json());

// const redisClient=new redis(process.env.REDIS_URL);




const rateLimitOptions=rateLimit({
    windowMs:15*60*1000,
    max:100,
    standardHeaders:true,
    legacyHeaders:false,
    handler:(req,res)=>{
        logger.warn(`Sensitive endpoint rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({ success: false, message: "Too many requests" });
  }
<<<<<<< HEAD
  // store:new RedisStore({
  //   sendCommand:(...args)=>redisClient.call(...args)
  // })
=======
//   store:new RedisStore({
//     sendCommand:(...args)=>redisClient.call(...args)
//   })
>>>>>>> c7f32dc (modification for redis)
})


app.use(rateLimitOptions);

app.use((req, res, next) => {
    logger.info(`Received ${req.method} request to ${req.url}`);
    logger.info(`Request body, ${req.body}`);
    next();
  });


app.use('/string',stringRoutes);



const proxyOptions={
    proxyReqPathResolver:(req)=>{
        return req.originalUrl.replace(/^\/v1/,"/api");
    },
    proxyErrorHandler:(err,res,next)=>{
       logger.error(`proxy error ${err.message}`);
       res.status(500).json({
        message:`Internal server error`,
        error:err.message,
       });
        
    }
};


//setting up payment service proxy

app.use("/v1/",
    proxy(process.env.PAYMENT_SERVICE_URL,{
        ...proxyOptions,
        proxyReqOptDecorator:(proxyReqOpts,srcReq)=>{
            proxyReqOpts.headers["Content-Type"]="application/json";
            return proxyReqOpts;
        },
        userResDecorator:(proxyRes,proxyResData,userReq,userRes)=>{
            logger.info(`Response receiver from payment service ${proxyRes.statusCode}`)
            return proxyResData;
        }
    })
);



app.get('/api/gfg-user/:username/:randomString', async (req, res) => {
    const { username,randomString } = req.params;
    const url = `${process.env.GFG_API_URL}${randomString}/user/${username}.json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            return res.status(response.status).json({ error: "Failed to fetch data" });
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});


app.get('/api/ninja-user/:username', async (req, res) => {
    const username=req.params.username;
    console.log(username)
    const url = `${process.env.CODING_NINJAS_DATA_URL}${username}`;
    const contributionUrl=`${process.env.CODING_NINJAS_CONTRIBUTION_URL}${username}&end_date=${new Date()}&start_date=2023-02-23T18:30:00%2B00:00&is_stats_required=true&unified=true&request_differentiator=1739869546365&app_context=publicsection&naukri_request=true`;
    console.log(contributionUrl)
    console.log(url);
    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
                "Accept": "application/json"
            }
        });
        const contributionResponse = await fetch(contributionUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: "Failed to fetch data" });
        }
        const contributionData=await contributionResponse.json();
        const data = await response.json();
        res.json({
            data,contributionData
        }

        );
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get('/api/gfg-user/submission/:year/:handle/:requestType', async (req, res) => {
    const { handle, year, requestType } = req.params;
    console.log("yes it was hit")
    
    const url = process.env.GFG_SUBMISSION_API_URL;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                handle,
                year,
                requestType
            }),
        });
        console.log("fetched")

        if (!response.ok) {
            logger.error(`error occured`);
            throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data from GFG API", details: error.message });
    }
});



app.get('/fetch-random-string', async (req, res) => {
    try {
        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
        const page = await browser.newPage();

        let randomString = "";

        page.on('request', (request) => {           
            const url = request.url();
            if (url.includes("gfg-assets/_next/data")) {
                const sp = url.split('/');
                randomString = sp[6];
                console.log(randomString);
            }
        });

        await page.goto(`${GFG_DEVELOPER_PROFILE_FOR_STRING}`, { waitUntil: 'networkidle2' });

        await new Promise((resolve) => setTimeout(resolve, 5000));

        await browser.close();
        
        res.json({ randomString });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(PORT, () => {
    logger.info(`API Gateway is running on port ${PORT}`);
});
