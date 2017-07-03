angular.module("caggleApp").controller('HeaderController', ["$scope","$state", "localStorageService", 
	
	function($scope,$state, localStorageService) {
  
	
	$scope.init = function() {
		alert("header..")
		$scope.currentUser = localStorageService.get('username'); 
		$rootScope.username = localStorageService.get('username'); 
	}
	
	
	
	$scope.init();
}]);