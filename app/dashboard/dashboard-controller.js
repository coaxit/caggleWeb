angular.module("caggleApp").controller('DashboardController', 
		["$scope","$state", "$anchorScroll","$location", "localStorageService", "$localStorage", "$rootScope", "$http",
			function($scope,$state,$anchorScroll,$location, localStorageService, $localStorage, $rootScope, $http) {


			$scope.IsVisibleStep1 = true;
			$scope.IsVisibleStep2 = false;
			$scope.IsVisibleStep3 = false;
			$scope.IsVisibleStep4 = false;
			$scope.IsVisibleStep5 = false;

			$scope.init = function() {
				$location.hash('step_1');
				$state.go('dashboard');
				$(".step-container").hide();
				$("#step_1").show(); 
			}


			$scope.scrollTo = function(id) {	    
				$anchorScroll();
				$(".step-container").hide();
				$("#" + id).show(); 
			}

			
			$scope.submitLoan = function(loan) {
				var restUrl =  getServerBaseUrl() + "/loanApplication/submitExistingLoan";

				$http({
					url: restUrl,
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					data: JSON.stringify({ loan })
				}).success(function(data) {
					alert("data.code" + data.code);
					if(data.code == '200') {    
						alert("call to step");
						$scope.scrollTo('step_2' );
					} else{

					}
				}).error(function(data,textStatus, xhr){
					if(textStatus == "401"){
						$window.location='#/pages/signin';
					}

				})
			}
			
			$scope.submitVehicledetails = function(vehicle) {
				var aa = getServerBaseUrl();
//				alert("aa " + aa);
				var restUrl =  getServerBaseUrl() + "vehicleDetails/submitVehicleDetails";

				$http({
					url: restUrl,
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					data: JSON.stringify({ vehicle })
				}).success(function(data) {
					alert("data.code" + data.code);
					if(data.code == '200') {    
						alert("call to vehicleData " + data.vehicleData);
						$scope.scrollTo('step_3' );
					} else{

					}
				}).error(function(data,textStatus, xhr){
					if(textStatus == "401"){
						$window.location='#/pages/signin';
					}

				})
			}



			$scope.stepProcess=function(user) {
				// alert("sdfsdfsd");
				console.log(user);

			}

			$scope.init();
		}]);
