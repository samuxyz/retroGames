var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var config = require('./config/config');
var mongoose = require('mongoose');
var request = require('request');
var async = require('async');
var bcrypt = require('bcryptjs');
var jwt = require('jwt-simple');
var moment = require('moment');
var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } }; 
mongoose.connect('mongodb://admin:admin@ds037215.mongolab.com:37215/retrogames', options);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));



var Game = require('./app/models/game');
var User = require('./app/models/user');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
//app.use(express.methodOverride());
app.use(express.static(__dirname + '/public'));

var router = express.Router();
var router2 = express.Router();

/*
 |--------------------------------------------------------------------------
 | Log in with Email
 |--------------------------------------------------------------------------
 */
app.post('/auth/login', function(req, res) {
  User.findOne({ email: req.body.email }, '+password', function(err, user) {
    if (!user) {
      return res.status(401).send({ message: 'Invalid email and/or password' });
    }
    user.comparePassword(req.body.password, function(err, isMatch) {
      if (!isMatch) {
        return res.status(401).send({ message: 'Invalid email and/or password' });
      }
      res.send({ token: createJWT(user) });
    });
  });
});
/*
 |--------------------------------------------------------------------------
 | Create Email and Password Account
 |--------------------------------------------------------------------------
 */
app.post('/auth/signup', function(req, res) {
  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      return res.status(409).send({ message: 'Email is already taken' });
    }
    var user = new User({
      displayName: req.body.displayName,
      email: req.body.email,
      password: req.body.password
    });
    user.save(function(err, result) {
      if (err) {
        res.status(500).send({ message: err.message });
      }
      res.send({ token: createJWT(result) });
    });
  });
});
/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */
function createJWT(user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
}
/*
 |--------------------------------------------------------------------------
 | Login with Facebook
 |--------------------------------------------------------------------------
 */
app.post('/auth/facebook', function(req, res) {
  var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
  var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
  var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
  console.log(config.FACEBOOK_SECRET);
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.FACEBOOK_SECRET,
    redirect_uri: req.body.redirectUri
  };

  // Step 1. Exchange authorization code for access token.
  request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
    if (response.statusCode !== 200) {
		console.log("here");
      return res.status(500).send({ message: accessToken.error.message });
    }
	console.log("here");
    // Step 2. Retrieve profile information about the current user.
    request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
      if (response.statusCode !== 200) {
        return res.status(500).send({ message: profile.error.message });
      } console.log(profile);
      if (req.header('Authorization')) {
        User.findOne({ facebook: profile.id }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a Facebook account that belongs to you' });
          }
          var token = req.header('Authorization').split(' ')[1];
          var payload = jwt.decode(token, config.TOKEN_SECRET);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.facebook = profile.id;
            user.picture = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
            user.displayName = user.displayName || profile.name;
            user.save(function() {
              var token = createJWT(user);
              res.send({ token: token });
            });
          });
        });
      } else {
        // Step 3. Create a new user account or return an existing one.
        User.findOne({ facebook: profile.id }, function(err, existingUser) {
          if (existingUser) {
            var token = createJWT(existingUser);
            return res.send({ token: token });
          }
          var user = new User();
          user.facebook = profile.id;
          user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
          user.displayName = profile.name;
          user.save(function() {
            var token = createJWT(user);
            res.send({ token: token });
          });
        });
      }
    });
  });
});

router.get('/', function(req, res){
	res.json({message: 'welcome to retrogames'});
});

router2.route("/")
	.get(function(req, res){
		res.sendfile('public/views/index.html', {root: __dirname });
	});
	
router.route('/games')
	//create a game
	.post(function(req,res){
		var game = new Game();
		game.name = req.body.name;
		game.year = req.body.year;
		game.description = req.body.description;
		game.picture = req.body.picture;
		console.log(game.name);
		game.save(function(err){
			if(err){
				res.send(err);
			}
			res.json({message: 'game created'});
			
		});
	})
	//get all the bear
	.get(function(req,res){
		Game.find(null,null,{sort: { postDate : 1}},function(err,games){
			if(err){
				res.send(err);
			}
			res.json(games);
		});
	});
router.route('/games/:game_id')
	//get a single game
	.get(function(req,res){
		Game.findById(req.params.game_id, function(err, game){
			if(err){
				res.send(err);
			}
			res.json(game);
		})
	
	})
	.put(function(req,res){
		Game.findById(req.params.game_id,function(err, game){
			if(err){
				res.send(err);
			}
			game.name = req.body.name;
			game.description = req.body.description;
			game.picture = req.body.picture;
			game.year = req.body.year;
			
			game.save(function(err){
				if(err){
					res.send(err);
				}
			});
			
			res.json({message: 'game updated!'});
		});
	})
	.delete(function(req,res){
		Game.remove({
			_id: req.params.game_id
		}, function(err, game){
			if(err){
				res.send(err);
			}
			res.json({message: 'successfully deleted'});
		});
	
	})
	
router2.route("/games/:page").get(function(req,res){
	console.log("here");
	var page = req.params.page;
	 res.sendfile('public/views/'+page+'.html', {root: __dirname });
});
router2.route("*").get(function(req,res){
	console.log("here");
	var page = req.params.page;
	 res.sendfile('public/views/index.html', {root: __dirname });
});

app.use('/api', router);
app.use(router2);
app.listen(3000);
