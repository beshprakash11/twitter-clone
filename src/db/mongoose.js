const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/twitter-api-course',{
    userNewUrlParser: true,
    useCreateIndex: true,
    useFindandModify: false,
    useUnifiedIndex: true

});