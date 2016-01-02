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



var router = express.Router();

router.get('/', function(req, res){
	res.json({message: 'welcome to retrogames'});
});


router.route('/games')
	//create a game
	.post(function(req,res){
		var game = new Game();
		game.name = req.body.name;
		game.year = req.body.year;
		game.description = req.body.description;
		
		game.save(function(err){
			if(err){
				res.send(err);
			}
			res.json({message: 'game created'});
			
		});
	})
	//get all the bear
	.get(function(req,res){
		Game.find(function(err,games){
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
	

app.use('/api', router);

app.listen(3000);
