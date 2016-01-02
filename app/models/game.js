var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var gameSchema = new Schema(
	{
		name: String,
		year: String,
		description: String
		
	}
);

module.exports = mongoose.model('Game', gameSchema);