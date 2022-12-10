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
    userId:{
        type: mongoose.Schema.Types.ObjectId,//connect to userid
        ref:'User', //Reference id come from Users
        required: true,
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