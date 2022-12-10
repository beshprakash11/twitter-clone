const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    username:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true, 
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email')
            }
        }
    },
    password:{
        type: String,
        required: true,
        minLength: 4,
        trim: true,
        validate(value){
            if(value.toLowerCase('password')){
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    avatar:{
        type: Buffer,
    },
    avatarExists:{
        type: Boolean,
    },
    bio: {
        type: String,
    },
    website: {
        type: String,
    },
    location: {
        type: String,
    },
    followers: {
        type: Array,
        default: []
    },
    followerings: {
        type: Array,
        default: []
    }
})

const User = mongoose.model('User', userSchema);
module.exports = User