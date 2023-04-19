const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// File imports 

const filmModel = require('./model/Film');


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

/////////////////////////////////////////////////////////////////////////////////////////



// Home route

app.get('/',(req,res)=>{
   async function homepager(){
      var homepagemovies = await filmFinder();
      // console.log(homepagemovies[0].);
      res.render('index',{homepagemovies : homepagemovies, error : '', heading : ''});
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
               res.render('index', {homepagemovies : '', error : 'sorry! no movie available in this category', heading : ''})
               return;
            }
            else {
               console.log(data.length);
              res.render('index', {homepagemovies : data, error : '', heading : `Search results for : ${req.body.search}`});
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
               res.render('index', {homepagemovies : '', error : 'sorry! no movie available in this category', heading : ''})
               return;
            }
            else {
               console.log(data.length);
              res.render('index', {homepagemovies : data, error : '', heading : 'Bollywood'});
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
               res.render('index', {homepagemovies : '', error : 'sorry! no movie available in this category', heading : '' })
               return;
            }
            else {
               console.log(data.length);
              res.render('index', {homepagemovies : data, error : '', heading : 'Hollywood'});
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
               res.render('index', {homepagemovies : '', error :  'sorry! no movie available in this category', heading : ''})
               return;
            }
            else {
               console.log(data.length);
              res.render('index', {homepagemovies : data, error : '', heading : 'Web - Series'});
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
               res.render('index', {homepagemovies : '', error :  'sorry! no movie available in this category', heading : ''})
               return;
            }
            else {
               console.log(data.length);
              res.render('index', {homepagemovies : data, error : '', heading : 'Old Movies'});
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
      const searchField= 'recommend';
      Film.find()
      .or({tags : {$regex: searchField, $options: '$i'}})
         .then(data => {
            if(data.length == 0){
               res.render('index', {homepagemovies : '', error :  'sorry! no movie available in this category', heading : ''})
               return;
            }
            else {
               console.log(data.length);
              res.render('index', {homepagemovies : data, error : '', heading : 'Our Recommendation'});
            }
         })
         .catch(err => {res.send('something went wrong!')});
      // res.send('in testing mode')
    }
    searchFunction(req, res);

})

// other routes



// ////////////////////////////

// Upload Form 

app.get('/upload', (req,res)=>{
   res.render('upload')
})

app.post('/upload',
 upload.fields([{name : 'bannerImage'},{name : 'screenshot1'}, {name : 'screenshot2'},{name : 'screenshot3'}])
// upload.single('bannerImage')
,(req, res, next)=>{
   // console.log(req.files.screenshot1[0].filename);
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
      videoLink : req.body.videoLink,
      tags : [req.body.tag1, req.body.tag2, req.body.tag3, req.body.tag4, req.body.tag5, req.body.tag6, req.body.tag7]
 
  });

  film.save();
 res.send('saved succesfully');
  console.log('thread is here now');

});







app.get('*', (req,res)=>{
   res.send('<h3 style="margin-top:30vh; text-align : center; font-family : Roboto, Oxygen, Ubuntu, sans-serif;">What??? <br><br> Error 404 <br><br> <a href="/">Link To Homepage</a></h3>');
})



// Mongoose functions



mongoose.connect('mongodb+srv://punit123:thisispassword@cluster0.orvqksv.mongodb.net/test', {useNewUrlParser:true, useUnifiedTopology:true})
  .then(()=> console.log('MongoDB is connected Succesfully'))
  .catch(err=> console.error('Unable to connect to mongoDB :' + err));


  const  filmSchema = filmModel;


const Film =  mongoose.model('Film', filmSchema);


// async function newFilmSaver(){
  

//    const film = new Film({
//        fullName : '3 Idiots (2009){Hindi} 480P[400MB] || 720P[1.1GB]',
//        bannerImage : './images.jpg',
//        name : '3 Idiots',
//        year : 2009,
//        duration : '160 min',
//        category : 'Romance, Comedy',
//        releaseDate : '25 Dec 2009',
//        imdbRating : 8.4,
//        imdbUser : 340000,
//        metascore : 74,
//        shortStoryline : 'Two friends are searching for their long last companion. They revisit their college days and recall the memories of their friend who inspired them to think differently, even as the rest of the world called them "idiots". Two friends are searching for their long last companion. They revisit their college days and recall the memories of their friend who inspired them to think differently, even as the rest of the world called them idiots.',
//        director : 'Rajkumar Hirani',
//        producer : 'Rajkumar Hirani',
//        actors : 'Kareena Kapoor, Aamir Khan, R Madhvan',
//        longStoryline : 'Two friends are searching for their long last companion. They revisit their college days and recall the memories of their friend who inspired them to think differently, even as the rest of the world called them "idiots". Two friends are searching for their long last companion. They revisit their college days and recall the memories of their friend who inspired them to think differently, even as the rest of the world called them idiots. Two friends are searching for their long last companion. They revisit their college days and recall the memories of their friend who inspired them to think differently, even as the rest of the world called them "idiots". Two friends are searching for their long last companion. They revisit their college days and recall the memories of their friend who inspired them to think differently, even as the rest of the world called them idiots.',
//        screenshot : ['./download.jpg', './download (1).jpg', './download (3).jpg'],
//        videoLink : 'https:google.com',
//        tags : ['Aamir Khan','movie', '2020', 'Kareena Kapoor', 'raj kumar hirani', 'best bollywood movie', 'top imdb movies bollywood']
//    });

//   const result = await film.save();
//   console.log(result);

// }

// newFilmSaver();


async function filmFinder(){
   const films =   await Film
  //    .find({ tag : /ife$/})
      //  .find({ tag : /^holly/})
  //    .find({ tag : /ife$/i}) case sensitive
      .find()
  //    .and([{ year : 1994}, { rating : 9}])
   //   .limit(10)
     .sort({year : -1})
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
// console.log()



app.listen( process.env.PORT || 3000, console.log('Listening on port 3000' ));





