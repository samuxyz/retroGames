angular.module('gameService', ['ngResource'])
	.factory('Game', function($resource){
		return $resource('/api/games/:id', null, 
			{
				'update' : { method : 'PUT'}
			}
		);
	});