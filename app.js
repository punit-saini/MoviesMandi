const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const multer = require('multer');

const fs = require('fs');
const path = require('path');


const storage = multer.diskStorage({
     destination : function(req,file,cb){
        cb(null,'./uploads');
     },
     filename : function(req,file,cb){
        cb(null, file.fieldname + '-' + Date.now());
     }
});

const upload = multer({storage : storage});



app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.static('uploads'));
app.set('view engine','ejs');


// Home route

app.get('/',(req,res)=>{
   async function homepager(){
      var homepagemovies = await filmFinder();
      // console.log(homepagemovies[0].);
      res.render('index',{homepagemovies : homepagemovies, error : ''});
   }
   homepager();
});



// Movie home route
app.get('/getFile/:id', (req,res)=>{
  async function oneFinder(){
      
      try {
         let data = await Film.findOne({_id: req.params.id});
         res.render('movie', {data : data});
         // console.log(`find one success ${data}`);
         if(!data){
            throw new Error('no document found');
         }
         return data;
      } catch (error) {
         res.send('something went wrong with this page. Please click on back button to use other sections of site');
         console.log(`findOne error --> ${error}`);
         return error;
      }

  }
  oneFinder();
  
});


// search route


app.post('/search',(req,res, next)=>{
   async function searchFunction(req,res){
      const searchField = req.body.search;
      Film.find()
      .or([{fullName : {$regex: searchField, $options: '$i'}},{tags : {$regex: searchField, $options: '$i'}}])
         .then(data => {
            if(data.length == 0){
               res.render('index', {homepagemovies : '', error : 'sorry this one is not available!. Please try another one.'})
               return;
            }
            else {
               console.log(data.length);
              res.render('index', {homepagemovies : data, error : ''});
            }
         })
         .catch(err => {res.send('something went wrong!')});
      // res.send('in testing mode')
    }
    searchFunction(req, res);
});

// bollywood movies 

app.get('/bollywood',(req,res)=>{

   async function searchFunction(req,res){
      const searchField= 'bollywood';
      Film.find()
      .or({tags : {$regex: searchField, $options: '$i'}})
         .then(data => {
            if(data.length == 0){
               res.render('index', {homepagemovies : '', error : 'sorry this page is not available!. Please try another one.'})
               return;
            }
            else {
               console.log(data.length);
              res.render('index', {homepagemovies : data, error : ''});
            }
         })
         .catch(err => {res.send('something went wrong!')});
      // res.send('in testing mode')
    }
    searchFunction(req, res);

})

// hollywood movies 


app.get('/hollywood',(req,res)=>{

   async function searchFunction(req,res){
      const searchField= 'hollywood';
      Film.find()
      .or({tags : {$regex: searchField, $options: '$i'}})
         .then(data => {
            if(data.length == 0){
               res.render('index', {homepagemovies : '', error : 'sorry this page is not available!. Please try another one.'})
               return;
            }
            else {
               console.log(data.length);
              res.render('index', {homepagemovies : data, error : ''});
            }
         })
         .catch(err => {res.send('something went wrong!')});
      // res.send('in testing mode')
    }
    searchFunction(req, res);

})


// web series 


app.get('/web-series',(req,res)=>{

   async function searchFunction(req,res){
      const searchField= 'web series';
      Film.find()
      .or({tags : {$regex: searchField, $options: '$i'}})
         .then(data => {
            if(data.length == 0){
               res.render('index', {homepagemovies : '', error : 'sorry this page is not available!. Please try another one.'})
               return;
            }
            else {
               console.log(data.length);
              res.render('index', {homepagemovies : data, error : ''});
            }
         })
         .catch(err => {res.send('something went wrong!')});
      // res.send('in testing mode')
    }
    searchFunction(req, res);

})


// old movie 

app.get('/old-movies',(req,res)=>{

   async function searchFunction(req,res){
      const searchField= 'old movie';
      Film.find()
      .or({tags : {$regex: searchField, $options: '$i'}})
         .then(data => {
            if(data.length == 0){
               res.render('index', {homepagemovies : '', error : 'sorry this page is not available!. Please try another one.'})
               return;
            }
            else {
               console.log(data.length);
              res.render('index', {homepagemovies : data, error : ''});
            }
         })
         .catch(err => {res.send('something went wrong!')});
      // res.send('in testing mode')
    }
    searchFunction(req, res);

})

// recommendation 

app.get('/recommendation',(req,res)=>{

   async function searchFunction(req,res){
      const searchField= 'recommendation';
      Film.find()
      .or({tags : {$regex: searchField, $options: '$i'}})
         .then(data => {
            if(data.length == 0){
               res.render('index', {homepagemovies : '', error : 'sorry this page is not available!. Please try another one.'})
               return;
            }
            else {
               console.log(data.length);
              res.render('index', {homepagemovies : data, error : ''});
            }
         })
         .catch(err => {res.send('something went wrong!')});
      // res.send('in testing mode')
    }
    searchFunction(req, res);

})







// Upload

app.get('/upload', (req,res)=> {
   res.render('upload');
})











// Upload Form 



app.post('/upload',
 upload.fields([{name : 'bannerImage'},{name : 'screenshot1'}, {name : 'screenshot2'},{name : 'screenshot3'}])
// upload.single('bannerImage')
,(req, res, next)=>{
   console.log(req.files.screenshot1[0].filename);
   const film = new Film({
      fullName : req.body.fullName,
      bannerImage : {
         data : fs.readFileSync(path.join(__dirname + '/uploads/' + req.files.bannerImage[0].filename)),
         contentType : 'image/jpg'
      },
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
      screenshotOne : {
         data : fs.readFileSync(path.join(__dirname + '/uploads/' + req.files.screenshot1[0].filename)),
         contentType : 'image/jpg'
      },
      screenshotTwo : {
         data : fs.readFileSync(path.join(__dirname + '/uploads/' + req.files.screenshot2[0].filename)),
         contentType : 'image/jpg'
      },
      screenshotThree : {
         data : fs.readFileSync(path.join(__dirname + '/uploads/' + req.files.screenshot3[0].filename)),
         contentType : 'image/jpg'
      },
      downloadLink : req.body.downloadLink,
      tags : [req.body.tag1, req.body.tag2, req.body.tag3, req.body.tag4, req.body.tag5, req.body.tag6, req.body.tag7]
 
  });

  film.save();
 res.send('saved succesfully');
  console.log('thread is here now');

});




app.get('/test', (req,res)=>{

   async function oneFid(){

      const result = await  Film.findById({_id : '5fec53417eca58261c7b598a'});
       res.render('test', {result: result});
      }
   oneFid();
   
})










// Mongoose functions



mongoose.connect('mongodb+srv://punit:punitsaini@cluster0.2r5ez.mongodb.net/films?retryWrites=true&w=majority', {useNewUrlParser:true, useUnifiedTopology:true})
  .then(()=> console.log('MongoDB is connected Succesfully'))
  .catch(err=> console.error('Unable to connect to mongoDB :' + err));


  const  filmSchema = new mongoose.Schema({
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
   subtitle : String,
   size : String,
   quality : String,
   format : String,
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
   downloadLink : String,
   tags : [{
      type : String
   }]
});


const Film =  mongoose.model('Film', filmSchema);


async function newFilmSaver(){
  

   const film = new Film({
       fullName : '3 Idiots (2009){Hindi} 480P[400MB] || 720P[1.1GB]',
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
   // console.log(films);
   return films;
  }

// filmFinder();

//  Bulk data deletor


// Film.deleteMany({bannerImage : {$ne : ''}}).then(function(){
//    console.log('Data Deleted');
// }).catch(function(error){
//    console.log('it is error', error);
// });




app.listen(process.env.PORT, console.log('Listening on port 3000'));



// Everything is good, need to create data using post and need to find out about how to store form data into a array of string. and one more minor thing; complete that multer thing how to change these stored images into actuall jpg image(from youtube video). that's it.


