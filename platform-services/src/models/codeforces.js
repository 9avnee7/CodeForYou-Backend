const mongoose = require('mongoose');

const codeforceSchema = new mongoose.Schema({
    name:{
        type:String
    },
    username: {
        type: String,
        required: true,
        // unique: true,
        lowercase: true
    },
    totalActiveDays: {
        type: Number,
        default:0
    },
    largestStreak: {
        type: Number,
        default:0
    },
    languagesSolved: [
        {
            languageName: { type: String },
            problemsSolved: { type: Number }
        }
    ],
    totalProblemsSolved:{
        type:Number,
        default:0
    },
    totalQSolved: [
        {
            QCategory: { type: String },
            QCounts: { type: Number }
        }
    ],
    topicWiseQSolved: [
        {
            categoryName: { type: String },
            topics: [
                {
                    topicName: { type: String },
                    problemCount: { type: Number }
                }
            ]
        }
    ],
    badges: [
        {
            badgeLink: { type: String },
            badgeName: { type: String },
            badgeDate: { type: String }
        }
    ],
    submissionCalendar: [
        {
            date: { type: Date },
            count: { type: Number }
        }
    ],
    contestDetails:[
        {
            contestName:String,
            rank:Number,
            rating:Number
        }
    ]
});

module.exports = mongoose.model('codeforces', codeforceSchema);