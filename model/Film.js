const mongoose = require('mongoose')

const schema =  new mongoose.Schema({
    fullName : String,
     bannerImage : {
        data : Buffer,
        contentType : String
     },
    name : String,
    year : Number,
    duration : String,
    category : String,
    releaseDate : String,
    imdbRating : Number,
    imdbUser : Number,
    metascore : Number,
    shortStoryline : String,
    director : String,
    producer : String,
    actors : String,
    language : String,
    longStoryline : String,
    screenshotOne : {
       data : Buffer,
       contentType : String
    },
    screenshotTwo : {
       data : Buffer,
       contentType : String
    },
    screenshotThree : {
       data : Buffer,
       contentType : String
    },
    videoLink : String,
    tags : [{
       type : String
    }]
 });

 module.exports = schema;