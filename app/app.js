 var app = angular.module("caggleApp",[
     'ui.router',
     'ui.bootstrap',
     'ngStorage',
     'LocalStorageModule'
	 ])
	 .config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$httpProvider", function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) 
	 {
	     $httpProvider.interceptors.push('httpRequestInterceptor');
	    $stateProvider
		    .state('signup', {
				url: '/signup',
				controller: 'SignupController',
				templateUrl: 'app/login/signup.html',
			})
	        .state('login', {
	            url: '/login',
	            controller: 'LoginController',
	            templateUrl: 'app/login/login.html',
	        })
	         .state('home', {
	            url: '/home',
	            templateUrl: 'app/home/home.html'
	        })
	        .state('dashboard', {
	            url: '/dashboard',
	            templateUrl: 'app/dashboard/dashboard.html'
	        })
	        .state('dashboard2', {
	            url: '/dashboard2',
	            templateUrl: 'app/dashboard/dashboard2.html'
	        })
	 
	       $urlRouterProvider.otherwise('/login');
	}]) .factory('httpRequestInterceptor', ["$sessionStorage", "$localStorage", "localStorageService", "$window",
			function ($sessionStorage, $localStorage, localStorageService, $window) {
	        return { 
	        	
	        	request: function (config) {
	        		/*
	        		if ( localStorageService.get('username') != null) {
	        			$window.location = '#/login';
		        	}
		        	*/
	                if ($sessionStorage.authToken) {
	                    config.headers['auth-token'] = $sessionStorage.authToken;
	                    config.headers['Accept'] = 'application/json';
	                }
	                return config;
	            }
	            
	        };
	    }])
	
