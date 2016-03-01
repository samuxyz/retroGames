(function(){
	var app = angular.module('myApp', ['ngRoute', 'ngResource', 'gameService', 'satellizer', 'toastr']).
	config(function($routeProvider, $locationProvider, $authProvider) {
		
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
			.when('/signup', {
				templateUrl : '/views/partials/signup.html',
				controller : 'SignupController',
				controllerAs: 'signupCtrl',
				resolve: {
					skipIfLoggedIn: skipIfLoggedIn
				}
			})
			.when('/login', {
				templateUrl : '/views/partials/login.html',
				controller : 'LoginController',
				controllerAs : 'login',
				resolve: {
				  skipIfLoggedIn: skipIfLoggedIn
				}
			})
			.when('/logout', {
				url: '/logout',
				template: null,
				controller: 'LogoutCtrl'
			})
			.otherwise({
				redirectTo: '/home'
			});
			
		$authProvider.facebook({
		  clientId: '187463001628270'
		});
		$locationProvider.html5Mode(true);
		
		function skipIfLoggedIn($q, $auth, $location) {
			var deferred = $q.defer();
			if ($auth.isAuthenticated()) {
			$location.path('/');
		  } else {
			deferred.resolve();
		  }
		  return deferred.promise;
		}

    function loginRequired($q, $location, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.resolve();
      } else {
        $location.path('/login');
      }
      return deferred.promise;
    }
		
	
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
	app.controller('LoginController', function($location, $auth, toastr){
		var self = this;
		this.login = function() {
		  $auth.login(self.user)
			.then(function() {
			  toastr.success('You have successfully signed in!');
			  $location.path('/');
			})
			.catch(function(error) {
			  toastr.error(error.data.message, error.status);
			});
		};
		this.authenticate = function(provider) {
		  $auth.authenticate(provider)
			.then(function() {
			  toastr.success('You have successfully signed in with ' + provider + '!');
			  $location.path('/');
			})
			.catch(function(error) {
			  if (error.error) {
				// Popup error - invalid redirect_uri, pressed cancel button, etc.
				toastr.error(error.error);
			  } else if (error.data) {
				// HTTP response error from server
				toastr.error(error.data.message, error.status);
			  } else {
				toastr.error(error);
			  }
			});
		};
	});
	app.controller('MainController', function($location, $auth, $scope){
		$scope.isAuthenticated = function() {
		  return $auth.isAuthenticated();
		};
	});
	app.controller('LogoutCtrl', function($location, $auth, toastr) {
    if (!$auth.isAuthenticated()) { return; }
    $auth.logout()
      .then(function() {
        toastr.info('You have been logged out');
        $location.path('/');
      });
  });
  app.controller('SignupController', function($scope, $location, $auth, toastr) {
	var self = this;
    this.signup = function() {
      $auth.signup(self.user)
        .then(function(response) {
          $auth.setToken(response);
          $location.path('/');
          toastr.info('You have successfully created a new account and have been signed-in');
        })
        .catch(function(response) {
          toastr.error(response.data.message);
        });
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