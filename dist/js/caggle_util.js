/**
 * 
 */

function getServerBaseUrl() {
	var server_url = "http://localhost:8181/CaggleApp";
//	var server_url = "http://demo.caggle.co.uk:8080/api";
	return server_url; 
}

/*function isLogged($window){
	if($window.sessionStorage.getItem("USER_INSTANCE") == null){
		$window.location='#/pages/signin';
		return false;
	} else if($window.localStorage.pswd && $window.localStorage.pswd){
                $window.location='#/dashboard';
                return true;
	} else {
		return true;
	}
}
*/