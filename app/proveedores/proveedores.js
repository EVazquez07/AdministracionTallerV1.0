'use strict';

angular.module('myApp.proveedores', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/proveedores', {
    templateUrl: 'proveedores/proveedores.html',
    controller: 'proveedoresCtrl'
  });
}])

.controller('proveedoresCtrl', ['$scope', '$firebaseObject', function($scope, $firebaseObject) {
    var ref = firebase.database().ref();

    $scope.informacion = null;
    $scope.textoGuardar = "Guardar";
    $scope.loading = false;
    $scope.nombre = "";
    $scope.rfc = "";
    $scope.mensaje = "";
    $scope.regex = '/^([A-Z,Ñ,&]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[A-Z|\d]{3})$/';
  
    $scope.cargarProveedores = function(registroNuevo, errorRegistro) {
      var obj = $firebaseObject(ref);
  
      obj.$loaded().then(function() {
  
        angular.forEach(obj, function(value, key) {
           if(key == "informacion")
           {
             value.proveedores = convertToArray(value.proveedores);
             $scope.informacion = value;
           }
       });
     
      });
  
      obj.$bindTo($scope, "data");
      if(registroNuevo) {
          if(errorRegistro) {
              $scope.mostrarMensaje("Se encontro un error al registrar el proveedor");
          } else {
              $scope.mostrarMensaje("Se agrego correctamente el proveedor");
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
        firebase.database().ref('informacion/proveedores').push().set({
          id: ID(),
          nombre: $scope.nombre,
          rfc : $scope.rfc
        }, function(error) {
          if (error) {
            // The write failed...
            $scope.cargarProveedores(true, true);
          } else {
            // Data saved successfully!
            $scope.cargarProveedores(true, false);
          }
        });
    };
  
    $scope.cargarProveedores(false, false);

}]);