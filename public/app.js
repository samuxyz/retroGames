(function(){
	var app = angular.module('myApp', []).
	config(['$locationProvider', function($locationProvider) {
    
    $locationProvider.html5Mode(true);
		}]);
	app.controller('ListController', function($http){
	
		
		this.gameList = {};
		var self = this;
		$http.get('/api/games')
			.success(function(data){
				self.gameList = data;
			});
		this.deleteGame = function(id){
		
			$http.delete("/api/games/"+id)
				.success(function(data){
					self.gameList = self.gameList.filter(function(game){
						return game._id != id;
					});
				console.log(id);
			});
		};		
		//this.gameList
		
	});
	app.controller('AddGameController', ['$http', '$log', function($http, $log){
	
		this.game = {};
		
		this.addGame = function(){
			$http.post('/api/games', this.game)
			.success(function(date){
				$log.log("here");
			})
			.error(function(err){
				console.log(err);
			});
			this.game = {};
		}
	}]);
	var games = [
			{
				name : "Super Mario Bros",
				description : "Super Mario Bros. is a 1985 platform video game internally developed by Nintendo R&D4 and published by Nintendo as a pseudo-sequel to the 1983 game Mario Bros.",
				year : 1986,
				picture : "mariobros.jpg"
			},
			{
				name : "Super Mario Bros 2",
				description : "Super Mario Bros. is a 1985 platform video game internally developed by Nintendo R&D4 and published by Nintendo as a pseudo-sequel to the 1983 game Mario Bros.",
				year : 1986,
				picture : "mariobros2.jpg"
			},
			{
				name : "Super Mario Bros 3",
				description : "Super Mario Bros. is a 1985 platform video game internally developed by Nintendo R&D4 and published by Nintendo as a pseudo-sequel to the 1983 game Mario Bros.",
				year : 1986,
				picture : "mariobros3.png"
			},
			{
				name : "Street Fighter 2",
				description : "Super Mario Bros. is a 1985 platform video game internally developed by Nintendo R&D4 and published by Nintendo as a pseudo-sequel to the 1983 game Mario Bros.",
				year : 1986,
				picture : "sf2.png"
			}
		];
})();