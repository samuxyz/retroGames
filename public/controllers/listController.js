var app = angular.module('listController', [])
	.controller('ListController', function($location, Game){	
		this.gameList = {};
		this.game = {};
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
		};
		this.viewGame = function(id){
			this.game = this.gameList.filter(function(game){
				return game._id === id;
			});
			this.game = this.game[0];
			
			$('#myModal').modal();  
		}  
	}); 