var express = require('express');
var app = express();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bodyParser = require('body-parser');
var path = require('path');
var multer  = require('multer');
var done = false;
var upload = multer({dest: 'uploads/'});
var fs = require('fs');

var config = require('config.js');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var FACEBOOK_APP_ID = config.facebook.app_id;
var FACEBOOK_APP_SECRET = config.facebook.app_secret;
var FACEBOOK_URL = config.facebook.url;


app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());

app.post('/search', function(req, res) {
  searchObj = {};
  searchObj.category = req.body.category;
  if (req.body.itemColor) {
    searchObj.color = {$in: req.body.itemColor.split(', ')};
  }
  if (req.body.itemWarmth) {
    searchObj.warmth = {$in: req.body.itemWarmth.split(', ')};
  }
  if (req.body.itemPattern) {
    searchObj.pattern = {$in: req.body.itemPattern.split(', ')};
  }
  if (req.body.itemFormality) {
    searchObj.formality = {$in: req.body.itemFormality.split(', ')};
  }
  Item.find(searchObj, function (err, results) {
    if (err) {
      throw err;
    }
    else {
      res.send(results);
    }
  })
});

app.use('/', express.static(__dirname + '/../client'));

mongoose.connect('mongodb://clozet:clozet@ds035593.mongolab.com:35593/clozet',function(err){
 if(err) throw err;
 console.log('connected to DB');
});


/*Configure the multer.*/

app.use(multer({ dest: './uploads/',
  rename: function (fieldname, filename) {
    return filename+ '-' +Date.now();
  },
  onFileUploadStart: function (file) {
    // console.log(file.originalname + ' is starting ...')
    // console.log(file);
  },
  onFileUploadComplete: function (file) {
    // console.log('file contains   ' + file);
    //  console.log('file.fieldname ====  ' +file.fieldname);
    //  console.log('file.path ===== ' + file.path);
    done=true;
  }
}));

/*Handling routes.*/
app.post('/api/photo',function(req,res){//Set up Controller file/function instead of anonymous function
  if(done==true){

    var newItem = new Item({
      category: req.body.category,
      color:req.body.itemColor,
      warmth: req.body.itemWarmth,
      pattern: req.body.itemPattern,
      formality: req.body.itemFormality,
      img: {}
    });
    newItem.img.data = fs.readFileSync(req.files.userPhoto.path)
    newItem.img.contentType = 'image/png';
    newItem.save(function(){
      console.log('saved item');
    });

    Closet.find({}, function(err, closet){
      if(closet[req.body.category])
      {
        closet[req.body.category].push(newItem);
      }
    });

    console.log('request');
    console.log(req)
    res.redirect('/success');
    res.end();
    // res.sendFile(path.resolve(__dirname + "/../client/success.html"));
  }
});

app.post('/api/outfits', function(req,res){
  var newOutfit = new Outfit({
    top: req.body._topId,
    bottom: req.body._topId,
    shoes: req.body._topId,
    outerwear: req.body._topId,
    img: {}
  })
  console.log('saved outfit');
  Outfit.find({}, function(err, outfit){
    outfits[req.body._itemId].push(newOutfit);
  })
  res.send('Outfit saved!');
  location.reload();
  res.render('.client/outfits.html');
});

//setting up OAuth facebook login
passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: FACEBOOK_URL //needs proper path/hostS
 }, function(accessToken, refreshToken, profile, done) {
      process.nextTick(function() {
      done(null, profile);

      var fbUser = new User({
        _id: profile._json.id,
        username:profile._json.name,
        closet_id:profile._json.id
      });
      var userCloset = new Closet({
        closet_id: profile._json.id
      });

      fbUser.save(function(){
        console.log('user saved to database');
      });
      userCloset.save(function(){
        console.log('made a new Closet');
      });
        //console.log(profile._json); //save this info into database using schema
   });
}));

passport.serializeUser(function(user, done) {
 done(null, user);
});

passport.deserializeUser(function(obj, done) {
 done(null, obj);
});
//***PASSPORT SHOULD BE IN SEPARATE FILE

//will store facebook given _id and name. closet_id === _id
//***EACH Schema need to be in different file***
var userSchema = new Schema({
 _id: {type:String,required: true},
 username:{ type: String, required: true, index: { unique: true } },
 closet_id:{type: String, required: true}
});

var closetSchema = new Schema({
 closet_id : {type: Schema.Types.ObjectId},
 tops: [{type: Schema.ObjectId, ref: ItemSchema}],
 bottoms:[{type: Schema.ObjectId, ref: ItemSchema}],
 shoes:[],
 accessories:[],
 onesie:[]
});

var ItemSchema = new Schema({
 _itemId : {type: Schema.Types.ObjectId},
 category: {type: String, required: true},
 color: {type: String, required: true},
 pattern: {type: String, required: true},
 warmth: {type: String},
 formality: {type: String},
 img: {type: String, required: true}
});

var OutfitSchema = new Schema({
  _itemId : {type: Schema.Types.ObjectId},
  top: {type: String, required: true},
  bottom: {type: String, required: true},
  shoes: {type: String, required: true},
  outerwear: {type: String, required: false}
});

var User = mongoose.model('User',userSchema);
var Closet = mongoose.model('Closet',closetSchema);
var Item = mongoose.model('Clothes',ItemSchema);
var Outfit = mongoose.model('Outfit',OutfitSchema);
//***EACH Schema need to be in different file***

app.get('/api/photo', function(req, res, next) {
 res.sendFile('./client/api/photo');
});

app.get('/success', function(req, res, next) {
 res.sendfile('./client/Profile.html');
});

app.get('/error', function(req, res, next) {
 res.sendFile('./client/error.html');
});

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
 successRedirect: '/success',
 failureRedirect: '/error'
}));

app.get('./outfits', function(req,res){
  res.sendFile('./client/outfits.html');
})

//when the user logs in they should receive the clothes in their closet
app.get('/closet',function(req,res){
 //get profile for each user
 //get the users closet object of arrays holding objects
Item.find({}, function(err, clothes){
  console.log('item is  : ' + clothes);
  res.send(clothes);
})

});

app.listen(process.env.PORT || 3000);
