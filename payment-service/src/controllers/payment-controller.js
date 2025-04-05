const express = require('express');
const razorpayInstance = require('../utils/razorpay');
const logger = require('../utils/logger');

const handlePayment = async (req, res) => {
    logger.info("Handle Payment endpoint hit");

    try {
        const { amount } = req.body;

        if (!amount) {
            return res.status(400).json({
                success: false,
                message: "Amount is required"
            });
        }

        const options = {
            amount: amount * 100, 
            currency: "INR",
            receipt: `receipt-${Math.floor(Math.random() * 100000)}`,
            payment_capture: 1
        };


        logger.info("Razorpay Instance:", razorpayInstance);

        const order = await razorpayInstance.orders.create(options);

        return res.status(200).json({
            success: true,
            orderId: order.id,
            orderDetails: order 
          });
    } catch (e) {
        logger.error(`Error occurred at handlePayment try block: ${e.message}`, e);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
};

module.exports = { handlePayment };