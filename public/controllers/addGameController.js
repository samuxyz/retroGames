var app = angular.module('addGameController', []); 
app.controller('AddGameController', function($location, Game, $routeParams){
		var id = $routeParams.id;
		this.game = {};
		var self = this;
		if(typeof id != 'undefined'){
			Game.get({id : id}, function(data){
				self.game = data;
			});
		}
		
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