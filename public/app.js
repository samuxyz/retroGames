(function(){
	var app = angular.module('myApp', ['ngRoute', 'ngResource', 'gameService']).
	config(function($routeProvider, $locationProvider) {
		
		$routeProvider
			.when('/home', {
				templateUrl : '/views/partials/home.html',
				controller : 'ListController',
				controllerAs : 'lCtrl'
			})
			.when('/addGame', {
				templateUrl : '/views/partials/addGame.html',
				controller : 'AddGameController',
				controllerAs : 'addGameCtrl'
			})
			.when('/addGame/:id', {
				templateUrl : '/views/partials/addGame.html',
				controller : 'AddGameController',
				controllerAs : 'addGameCtrl'
			})
			.otherwise({
				redirectTo: '/home'
			});
		$locationProvider.html5Mode(true);
		
	
	});
	app.controller('ListController', function($location, Game){	
		this.gameList = {};
		var self = this;
		Game.query(function(data){
			self.gameList = data;
		});
		
		this.deleteGame = function(id){
			Game.delete({id : id}, function(){
				self.gameList = self.gameList.filter(function(game){
						return game._id != id;
					});
			});
		};
		this.editGame = function(id){
			$location.path('/addGame/' + id);
		}
		
	});
	app.controller('AddGameController', function($location, Game, $routeParams){
		var id = $routeParams.id;
		this.game = {};
		var self = this;
		if(typeof id != 'undefined'){
			Game.get({id : id}, function(data){
				self.game = data;
			})
		};
		
		this.addGame = function(){
			if(typeof id != 'undefined'){
				Game.update({id : id}, this.game, function(){
					$location.path('/home');
				});
			}else{
				Game.save(this.game, function(){
					$location.path('/home');
				});
			}
		};
	});
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