const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({dest : 'uploads/'});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine','ejs');


app.get('/',(req,res)=>{
   async function homepager(){
      var homepagemovies = await filmFinder();
      // console.log(homepagemovies[0].);
      res.render('index',{homepagemovies : homepagemovies});
   }
   homepager();
});

app.get('/movie', (req,res)=>{
   res.render('movie');
})

app.get('/upload', (req,res)=> {
   res.render('upload');
})











// Upload Form 



app.post('/upload',upload.fields([{name : 'bannerImage'},{name : 'screenshot1'}, {name : 'screenshot2'},{name : 'screenshot3'}]),(req, res, next)=>{
   console.log(req.files.screenshot1[0].path);
   const film = new Film({
      fullName : req.body.fullName,
      bannerImage : req.files.bannerImage[0].path,
      name : req.body.name,
      year : req.body.year,
      duration : req.body.duration,
      category : req.body.category,
      releaseDate : req.body.releaseDate,
      imdbRating : req.body.imdbRating,
      imdbUser : req.body.imdbUser,
      metascore : req.body.metascore,
      shortStoryline : req.body.shortStoryline,
      director : req.body.director,
      producer : req.body.producer,
      actors : req.body.actors,
      language : req.body.language,
      subtitle : req.body.subtitle,
      size : req.body.size,
      quality : req.body.quality,
      format : req.body.format,
      longStoryline : req.body.longStoryline,
      screenshot : [ req.files.screenshot1[0].path, req.files.screenshot2[0].path, req.files.screenshot3[0].path],
      downloadLink : req.body.downloadLink,
      tags : [req.body.tag1, req.body.tag2, req.body.tag3, req.body.tag4, req.body.tag5, req.body.tag6, req.body.tag7]
 
  });

  film.save();
 res.send('now uploaded');
  console.log('thread is here now');

});











// Mongoose functions



mongoose.connect('mongodb://localhost:27017/films', {useNewUrlParser:true, useUnifiedTopology:true})
  .then(()=> console.log('MongoDB is connected Succesfully'))
  .catch(err=> console.error('Unable to connect to mongoDB :' + err));


  const  filmSchema = new mongoose.Schema({
   fullName : String,
    bannerImage : String,
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
   subtitle : String,
   size : String,
   quality : String,
   format : String,
   longStoryline : String,
   screenshot : [{
      required : true,
      type : String
   }],
   downloadLink : String,
   tags : [{
      required : true,
      type : String
   }]
});


const Film =  mongoose.model('Film', filmSchema);


async function newFilmSaver(){
  

   const film = new Film({
       fullname : '3 Idiots (2009){Hindi} 480P[400MB] || 720P[1.1GB]',
       bannerImage : './images.jpg',
       name : '3 Idiots',
       year : 2009,
       duration : '160 min',
       category : ['romance', 'comedy'],
       releaseDate : '25 Dec 2009',
       imdbRating : 8.4,
       imdbUser : 340000,
       metascore : 74,
       shortStoryline : 'Two friends are searching for their long last companion. They revisit their college days and recall the memories of their friend who inspired them to think differently, even as the rest of the world called them "idiots". Two friends are searching for their long last companion. They revisit their college days and recall the memories of their friend who inspired them to think differently, even as the rest of the world called them idiots.',
       director : 'Rajkumar Hirani',
       producer : 'Rajkumar Hirani',
       actors : 'Kareena Kapoor, Aamir Khan, R Madhvan',
       language : 'Hindi',
       subtitle : 'Yes',
       size : '1.1Gb',
       quality : '720P',
       format : 'mkv',
       longStoryline : 'Two friends are searching for their long last companion. They revisit their college days and recall the memories of their friend who inspired them to think differently, even as the rest of the world called them "idiots". Two friends are searching for their long last companion. They revisit their college days and recall the memories of their friend who inspired them to think differently, even as the rest of the world called them idiots. Two friends are searching for their long last companion. They revisit their college days and recall the memories of their friend who inspired them to think differently, even as the rest of the world called them "idiots". Two friends are searching for their long last companion. They revisit their college days and recall the memories of their friend who inspired them to think differently, even as the rest of the world called them idiots.',
       screenshot : ['./download.jpg', './download (1).jpg', './download (3).jpg'],
       downloadLink : 'https:google.com',
       tags : ['Aamir Khan','movie', '2020', 'Kareena Kapoor', 'raj kumar hirani', 'best bollywood movie', 'top imdb movies bollywood']
   });

  const result = await film.save();
  console.log(result);

}

// newFilmSaver();


async function filmFinder(){
   const films =   await Film
  //    .find({ tag : /ife$/})
      //  .find({ tag : /^holly/})
  //    .find({ tag : /ife$/i}) case sensitive
      .find()
  //    .and([{ year : 1994}, { rating : 9}])
   //   .limit(10)
   //   .sort({name : -1})
   //   .select({ fullname : 1, bannerImage : 1})
      // .count();
   console.log(films);
   return films;
  }

filmFinder();

//  Bulk data deletor


// Film.deleteMany({fullName : {$ne : ''}}).then(function(){
//    console.log('Data Deleted');
// }).catch(function(error){
//    console.log('it is error', error);
// });




app.listen('3009', console.log('Listening on port 3000'));



// Everything is good, need to create data using post and need to find out about how to store form data into a array of string. and one more minor thing; complete that multer thing how to change these stored images into actuall jpg image(from youtube video). that's it.