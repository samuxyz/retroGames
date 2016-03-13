var app = angular.module('loginController', []);
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