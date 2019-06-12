'use strict';

angular.module('myApp.clientes', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/clientes', {
    templateUrl: 'clientes/clientes.html',
    controller: 'clientesCtrl'
  });
}])

.controller('clientesCtrl', ['$scope', '$firebaseObject', function($scope, $firebaseObject) {
  var ref = firebase.database().ref();

  $scope.informacion = null;
  $scope.textoGuardar = "Guardar";
  $scope.loading = false;
  $scope.nombre = "";
  $scope.rfc = "";
  $scope.mensaje = "";
  $scope.regex = '/^([A-Z,Ñ,&]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[A-Z|\d]{3})$/';

  $scope.cargarClientes = function(registroNuevo, errorRegistro) {
    var obj = $firebaseObject(ref);

    obj.$loaded().then(function() {

      angular.forEach(obj, function(value, key) {
         if(key == "informacion")
         {
           value.clientes = convertToArray(value.clientes);
           $scope.informacion = value;
         }
     });
      
    });

    obj.$bindTo($scope, "data");
    if(registroNuevo) {
        if(errorRegistro) {
            $scope.mostrarMensaje("Se encontro un error al registrar el cliente");
        } else {
            $scope.mostrarMensaje("Se agrego correctamente el cliente");
        }
    }
  };

  var convertToArray = function(objeto) {
    var res = [];
    for (var x in objeto){
        objeto.hasOwnProperty(x) && res.push(objeto[x])
    }
    return res;
  }

  var ID = function () {
    return '_' + Math.random().toString(36).substr(2, 9);
  };

  $scope.mostrarMensaje = function(mensaje) {
    $scope.mensaje = mensaje;
    $('#exampleModalCenter').modal('toggle');
    $scope.textoGuardar = "Guardar";
    $scope.loading = false;
    $scope.nombre = "";
    $scope.rfc = "";
    $('#collapseExample').collapse('toggle');
  };

  $scope.guardar = function() {
      $scope.textoGuardar = "Guardando...";
      $scope.loading = true;
      firebase.database().ref('informacion/clientes').push().set({
        id: ID(),
        nombre: $scope.nombre,
        rfc : $scope.rfc
      }, function(error) {
        if (error) {
          // The write failed...
          $scope.cargarClientes(true, true);
        } else {
          // Data saved successfully!
          $scope.cargarClientes(true, false);
        }
      });
  };

  $scope.cargarClientes(false, false);

}]);