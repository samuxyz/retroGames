var app = angular.module('mainController', []);
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