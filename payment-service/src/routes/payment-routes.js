const express=require('express');

const router=express.Router();

const {handlePayment}=require('../controllers/payment-controller')

router.post('/create-order',handlePayment);


module.exports=router