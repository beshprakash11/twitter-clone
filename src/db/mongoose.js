const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/twitter-api-course',{
    userNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true

});
//mongoose.set('strictQuery', true);