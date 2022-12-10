const mongoose = require('mongoose');

const tweetSchema =new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: Buffer
    },
    likes:{
        type: Array,
        default: [],
    }
},{
    timestamps: true
});

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet