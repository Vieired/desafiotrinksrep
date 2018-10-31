angular.module("ModuloSWAPI", ['ngRoute'])
.config(function($routeProvider) {
	$routeProvider
	.when("/home", {
		templateUrl: "view/home.html",
		controller: "IndexCtrl"
	})

    $routeProvider.otherwise({redirectTo: "/home"});
})