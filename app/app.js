'use strict';

// Declare app level module which depends on views, and core components
angular.module('myApp', [
  'ngRoute',
  'myApp.cuentasxcobrar',
  'myApp.cuentasxpagar',
  'myApp.login',
  'myApp.home',
  'myApp.clientes',
  'myApp.proveedores',
  'myApp.historial',
  'myApp.version',
  'firebase',
  'ngStorage'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  var config = {
    apiKey: "AIzaSyDbbc-j-mrcW3-VroTq3p_kvojt3YS-Qpk",               // Your Firebase API key
    authDomain: "administraciontaller-22ba7.firebaseapp.com",       // Your Firebase Auth domain ("*.firebaseapp.com")
    databaseURL: "https://administraciontaller-22ba7.firebaseio.com/",     // Your Firebase Database URL ("https://*.firebaseio.com")
  };
  firebase.initializeApp(config);

  $routeProvider
    .when("/login", {
        templateUrl: "login/login.html",
        controller : "loginCtrl"
    })
    .when("/home", {
      templateUrl: "home/home.html",
      controller : "homeCtrl"
    })
    .when("/clientes", {
      templateUrl: "clientes/clientes.html",
      controller : "clientesCtrl"
    })
    .when("/proveedores", {
      templateUrl: "proveedores/proveedores.html",
      controller : "proveedoresCtrl"
    })
    .when("/cuentasxcobrar", {
      templateUrl: "cuentasxcobrar/cuentasxcobrar.html",
      controller : "cuentasxcobrarCtrl"
    })
    .when("/cuentasxcobrarnuevo", {
      templateUrl: "cuentasxcobrar/cuentasxcobrarnuevo.html",
      controller : "cuentasxcobrarnuevoCtrl"
    })
    .when("/cuentasxpagar", {
      templateUrl: "cuentasxpagar/cuentasxpagar.html",
      controller : "cuentasxpagarCtrl"
    })
    .when("/cuentasxpagarnuevo", {
      templateUrl: "cuentasxpagar/cuentasxpagarnuevo.html",
      controller : "cuentasxpagarnuevoCtrl"
    })
    .when("/consultarimpuestos", {
      templateUrl: "historial/historial.html",
      controller : "historialCtrl"
    })
    .otherwise({
        redirectTo: "/login"
  });

}])
.run(['$rootScope', '$localStorage', '$location',
function($rootScope, $localStorage, $location){
	$rootScope.$on('$routeChangeStart', function(e, next){
    if(!$localStorage.login) {
      $location.path('/login');
    }
	});
}])
.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
])
.controller('mainCtrl', ['$scope', '$localStorage', 'Auth', '$location', '$window', '$timeout', function($scope, $localStorage, Auth, $location, $window, $timeout) {
  $scope.login = $localStorage.login;
  $scope.auth = Auth;
  $scope.logout = function() {
    $localStorage.login = false;
    Auth.$signOut();
    $location.path('/login');
    $timeout(function(){ $window.location.reload(); },1000);
  }
}]);
