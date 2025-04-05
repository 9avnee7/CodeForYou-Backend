require('dotenv').config();
const express=require('express');
// const mongoose=require('mongoose');
const logger=require('./utils/logger');
const cors=require('cors');
const helmet=require('helmet');
// const {RateLimiterRedis}=require('rate-limiter-flexible');
const {rateLimit}=require('express-rate-limit');
// const errorHandler=require('./middleware/errorHandler');

// const redis=require('ioredis');

// const {RedisStore} = require('rate-limit-redis');
const proxy=require('express-http-proxy');
// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fetch = require('node-fetch');
const stringRoutes=require('./routes/routes')
const mongoose=require('mongoose');
const puppeteer=require('puppeteer')
// const {validateToken} = require('./middleware/authMiddleware');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;




mongoose.connect(process.env.MongoDB_URL).then(result=>logger.info("mongo db connected")).catch(e=>console.log("error occured"));

app.set('trust proxy', 1);

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
    const username = req.params.username;
    console.log("Username received:", username);

    const baseDataUrl = process.env.CODING_NINJAS_DATA_URL;
    const baseContributionUrl = process.env.CODING_NINJAS_CONTRIBUTION_URL;

    const url = `${baseDataUrl}${username}&request_differentiator=1739884394206&app_context=publicsection&naukri_request=true`;

    const contributionUrl = `${baseContributionUrl}${username}&end_date=${new Date().toISOString()}&start_date=2023-02-23T18:30:00%2B00:00&is_stats_required=true&unified=true&request_differentiator=${Date.now()}&app_context=publicsection&naukri_request=true`;

    console.log("Data URL:", url);
    console.log("Contribution URL:", contributionUrl);

    try {
        console.log("Fetching contribution data...");
        const contributionResponse = await axios.get(contributionUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
                "Accept": "application/json",
                "Accept-Language": "en-US,en;q=0.9",
                "Referer": "https://www.naukri.com/",
                "Origin": "https://www.naukri.com",
                "Connection": "keep-alive"
              },
              
            timeout: 10000 
        });

        console.log("Fetching main data...");
        const dataResponse = await axios.get(url, 
            {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
                    "Accept": "application/json",
                    "Accept-Language": "en-US,en;q=0.9",
                    "Referer": "https://www.naukri.com/",
                    "Origin": "https://www.naukri.com",
                    "Connection": "keep-alive"
                  },
                  
            timeout: 10000
        });

        console.log("Successfully fetched and parsed data.");

        res.json({
            data: dataResponse.data,
            contributionData: contributionResponse.data
        });

    } catch (error) {
        console.error("Error during fetch:", error.message || error);

        if (error.code === 'ECONNABORTED') {
            return res.status(504).json({ error: "Request timed out" });
        }

        if (error.response) {
            return res.status(error.response.status).json({ error: error.response.statusText });
        }

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
        console.log(error)
        res.status(500).json({ error: "Failed to fetch data from GFG API", details: error.message });
    }
});




app.get('/fetch-random-string', async (req, res) => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();

        let randomString = null;

        page.on('request', (request) => {
            const url = request.url();
            if (url.includes('gfg-assets/_next/data')) {
                const match = url.match(/\/gfg-assets\/_next\/data\/([^/]+)\//);
                if (match) {
                    randomString = match[1];
                    console.log("Extracted random string:", randomString);
                }
            }
        });

        // Navigate with increased timeout
        await page.goto(process.env.GFG_DEVELOPER_PROFILE_FOR_STRING, {
            waitUntil: 'networkidle0',
            timeout: 60000
        });

        await page.waitForTimeout(4000);

        await browser.close();

        if (!randomString) {
            return res.status(500).json({ error: 'Could not extract random string. Structure might have changed.' });
        }

        res.json({ randomString });
    } catch (error) {
        console.error("Puppeteer error:", error);
        res.status(500).json({ error: error.message });
    }
});



app.listen(PORT, () => {
    logger.info(`API Gateway is running on port ${PORT}`);
});
