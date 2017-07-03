angular.module("caggleApp").controller('DashboardController', 
		["$scope","$state", "$anchorScroll","$location", "localStorageService", "$localStorage", "$rootScope",
	function($scope,$state,$anchorScroll,$location, localStorageService, $localStorage, $rootScope) {
	
	
	$scope.IsVisibleStep1 = true;
	$scope.IsVisibleStep2 = false;
	$scope.IsVisibleStep3 = false;
	$scope.IsVisibleStep4 = false;
	$scope.IsVisibleStep5 = false;

	$scope.init = function() {

	      $location.hash('step_1');
			$state.go('dashboard');
		$("#step_1").show();
	     $("#step_2").hide();
	     $("#step_3").hide();
	     $("#step_4").hide();
	     $("#step_5").hide()
	     
	     alert("init...");
	     	var aa = localStorageService.get('username'); 
			alert(aa);
			var abc = $localStorage.username;
			alert("local "+abc);

			alert("header.." + $rootScope.username)
    }
	
	
	$scope.scrollTo = function(id) {
	    
	     $anchorScroll();
	     $("#step_1").hide();
	     $("#step_2").hide();
	     $("#step_3").hide();
	     $("#step_4").hide();
	     $("#step_5").hide();
	     $("#" + id).show();
	     
	  }

	$scope.stepProcess=function(user) {
		alert("sdfsdfsd");
		console.log(user);
		
	}
	
	$scope.init();
}]);
