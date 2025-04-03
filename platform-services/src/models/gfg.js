const mongoose = require('mongoose');
const logger = require('../utils/logger');

logger.info('Creating LeetCode Schema');

const gfgSchema = new mongoose.Schema({
            username: {
                type: String,
                required: true,
                // unique: true, 
                lowercase: true
            },
            largestStreak: {
                type: Number,
                default: 0
            },
            totalActiveDays: {
                type: Number,
                default: 0
            },
            languagesSolved: [
                String
            ],
            totalProblemsSolved:{
                type:Number,
                default:0
            },
            totalQSolved: [
                {
                    QCategory: { type: String },
                    QCounts: { type: Number, default: 0 }
                }
            ],
            topicWiseQSolved: [
                {
                    categoryName: { type: String },
                    topics: [
                        {
                            topicName: { type: String },
                            problemCount: { type: Number, default: 0 }
                        }
                    ]
                }
            ],
            badges: [
                {
                    badgeLink: { type: String },
                    badgeName: { type: String },
                    badgeDate: { type: Date, default: Date.now }
                }
            ],
            submissionCalendar: [
                {
                    date: { type: Date },
                    count: { type: Number, default: 0 }
                }
            ]
});

module.exports = mongoose.model('GFG', gfgSchema);