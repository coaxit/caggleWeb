angular.module("caggleApp").controller('LoginController', ["$scope","$state", "$http", "$rootScope", "localStorageService" , "$localStorage", 
	function($scope,$state, $http, $rootScope, localStorageService, $localStorage ) {
	
	
	$scope.login=function(user) {
		console.log($scope.user.email);
		
		var restUrl =  getServerBaseUrl() +  "/user/login";
		if($scope.user.email && $scope.user.password) {
			$http({
				url: restUrl,
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				data: JSON.stringify({ user })
			}).success(function(data) {
				if(data.code == '200'){
					
					$rootScope.username = data.currentUser.username;
					localStorageService.set('username', data.currentUser.username);
//					$localStorage.username = data.currentUser.username;
//					alert($rootScope.username);
					$state.go('dashboard');
				} else{
					alert("Invalid Login");
				}
			}).error(function(data,textStatus, xhr){
				if(textStatus == "401"){
					alert("Invalid Login");
				}
				
			})
			
		}
	}
}]);


angular.module("caggleApp").controller('SignupController', ["$scope","$state", "$http", "$window", "$rootScope", 
	function($scope,$state, $http, $window, $rootScope) {

	$scope.signup = function(user) {
		if($scope.user.password != $scope.user.confirmPassword) {
			alert("Password does not match.");
		} else {
			var restUrl =  getServerBaseUrl() + "/user/signup";
			
			$http({
				url: restUrl,
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				data: JSON.stringify({ user })
			}).success(function(data) {
				if(data.code == '200'){
					$state.go('login');
				} else{
					
				}
			}).error(function(data,textStatus, xhr){
				if(textStatus == "401"){
					$window.location='#/pages/signin';
				}
				
			})
		}
		
	}
	
}]);