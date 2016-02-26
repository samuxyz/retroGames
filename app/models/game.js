var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var gameSchema = new Schema(
	{
		name: String,
		year: String,
		description: String,
		picture: String,
		postDate : { type : Date, default: Date.now }
		
	}
);

module.exports = mongoose.model('Game', gameSchema);