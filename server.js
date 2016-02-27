var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } }; 
mongoose.connect('mongodb://admin:admin@ds037215.mongolab.com:37215/retrogames', options);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));



var Game = require('./app/models/game');


app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
//app.use(express.methodOverride());
app.use(express.static(__dirname + '/public'));

var router = express.Router();
var router2 = express.Router();




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
