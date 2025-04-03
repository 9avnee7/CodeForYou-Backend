const express=require('express');
const {postGFGDataToDB, postLeetcodeDataToDB,fetchLeetcodeDataFromDB,fetchCodeforcesDataFromDB,fetchGFGDataFromDB,postCodingNinjasDataToDB,fetchCodingNinjaseDataFromDB,postcodeforcesDataToDB}=require('../controllers/platform-controller')
const router=express.Router();

router.post('/postgfgdata',postGFGDataToDB);

router.post('/postleetcodedata',postLeetcodeDataToDB)

router.post('/postcodingninjasdata',postCodingNinjasDataToDB)


router.post('/postcodeforcesdata',postcodeforcesDataToDB)


router.get('/fetchleetcodedatafromDB/:id',fetchLeetcodeDataFromDB);
router.get('/fetchcodeforcesdatafromDB/:id',fetchCodeforcesDataFromDB);


router.get('/fetchGFGdatafromDB/:id',fetchGFGDataFromDB);

router.get('/fetchcodingninjasdatafromDB/:id',fetchCodingNinjaseDataFromDB);

module.exports=router