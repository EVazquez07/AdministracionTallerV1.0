'use strict';

angular.module('myApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'loginCtrl'
  });
}])

.controller('loginCtrl', ['$scope', '$http', 'Auth', '$localStorage', '$location', '$window', '$timeout', function($scope, $http, Auth, $localStorage, $location, $window, $timeout) {
    $scope.auth = Auth;
    $scope.email = "";
    $scope.password = "";
    $scope.textoLogin = "Acceder";
    $scope.loading = false;
    $scope.login = function() {
      $scope.textoLogin = "Iniciando...";
      $scope.loading = true;
      console.log("Email -> ", $scope.email);
      console.log("Pass -> ", $scope.password);

      Auth.$signInWithEmailAndPassword($scope.email, $scope.password).then(function(firebaseUser) {
        console.log("Signed in as:", firebaseUser.uid);
        $localStorage.login = true;
        $location.path('/home');
        $timeout(function(){ $window.location.reload(); },1000);
      }).catch(function(error) {
        $localStorage.login = false;
        $scope.textoLogin = "Acceder";
        $scope.loading = false;
        console.error("Authentication failed:", error);
        $('#exampleModalCenter').modal('toggle');
        //$location.path('/login');
        //$timeout(function(){ $window.location.reload(); },1000);
      });
    };
}]);