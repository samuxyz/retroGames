(function(){
	var app = angular.module('myApp', ['ngRoute', 'ngResource', 'gameService', 'satellizer', 'toastr', 'listController', 'mainController', 'signupController', 'addGameController', 'loginController']).
	config(function($routeProvider, $locationProvider, $authProvider) {
		//Routing through the pages
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
		//Authentications with client-id
		$authProvider.facebook({
		  clientId: '187463001628270'
		});
		$authProvider.google({
		  clientId: '720541124659-t91ku790c6mhqd6dcgmgtiijd3is8b3u.apps.googleusercontent.com'
		});
		$authProvider.github({
		  clientId: '43cfdd19ba5347ecba1c'
		});
		$authProvider.linkedin({
		  clientId: '75qly5p5bgwm8s'
		});
		$authProvider.twitter({
		  url: '/auth/twitter'
		});
		$locationProvider.html5Mode(true);
		
		//Support functions for  basic access control
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
})();