'use strict';

angular.module('myApp.cuentasxcobrar', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/cuentasxcobrar', {
    templateUrl: 'cuentasxcobrar/cuentasxcobrar.html',
    controller: 'cuentasxcobrarCtrl'
  })
  .when('/cuentasxcobrarnuevo', {
    templateUrl: 'cuentasxcobrar/cuentasxcobrarnuevo.html',
    controller: 'cuentasxcobrarnuevoCtrl'
  });
}])

.controller('cuentasxcobrarCtrl', ['$scope', '$firebaseObject', function($scope, $firebaseObject) {
  var ref = firebase.database().ref();

  $scope.informacion = null;

  $scope.cargarCuentas = function() {
    var obj = $firebaseObject(ref);

    obj.$loaded().then(function() {

      angular.forEach(obj, function(value, key) {
         if(key == "informacion")
         {
           value.cuentas.cuentasporcobrar = convertToArray(value.cuentas.cuentasporcobrar);
           $scope.informacion = value;
         }
     });     
    });

    obj.$bindTo($scope, "data");
  };

  var convertToArray = function(objeto) {
    var res = [];
    for (var x in objeto){
        objeto.hasOwnProperty(x) && res.push(objeto[x])
    }
    return res;
  }

  $scope.cargarCuentas();
}])
.controller('cuentasxcobrarnuevoCtrl', ['$scope', '$firebaseObject', function($scope, $firebaseObject) {
  var ref = firebase.database().ref();

  $scope.informacion = null;
  $scope.nombreCliente = "";
  $scope.idProveedor = "";
  $scope.folio = "";
  $scope.fecha = "";
  $scope.total = "";
  $scope.textoGuardar = "Guardar";
  $scope.loading = false;
  $scope.error = false;

  $scope.cargarDeNuevo = function () {
    $route.reload();
  };

  $scope.cargarCuentas = function() {
    var obj = $firebaseObject(ref);

    obj.$loaded().then(function() {

      angular.forEach(obj, function(value, key) {
         if(key == "informacion")
         {
           value.cuentas.cuentasporpagar = convertToArray(value.cuentas.cuentasporpagar);
           $scope.informacion = value;
         }
     });  
    });

    obj.$bindTo($scope, "data");
  };

  var convertToArray = function(objeto) {
    var res = [];
    for (var x in objeto){
        objeto.hasOwnProperty(x) && res.push(objeto[x])
    }
    return res;
  }

  $scope.complete=function(string){		
    var output=[];
    angular.forEach($scope.informacion.proveedores,function(proveedor){
      if(proveedor.nombre.toLowerCase().indexOf(string.toLowerCase())>=0){
        output.push(proveedor);
      }
    });
    $scope.filterProveedor = output;
  }

  $scope.fillTextbox=function(proveedor){
    $scope.nombreCliente = proveedor.nombre;
    $scope.idProveedor = proveedor.id;
    $scope.filterProveedor = null;
  }

  $scope.mostrarMensaje = function() {
    $('#exampleModalCenter').modal('toggle');
  };

  $scope.limpiarCampos = function () { 
    $scope.textoGuardar = "Guardar";
    $scope.loading = false;
    $scope.nombreCliente = "";
    $scope.idProveedor = "";
    $scope.folio = "";
    $scope.fecha = "";
    $scope.total = "";
    $scope.error = false;
  };

  $scope.guardar = function() {
    $scope.textoGuardar = "Guardando...";
    $scope.loading = true;
    firebase.database().ref('informacion/cuentas/cuentasporcobrar').push().set({
        idProveedor : $scope.idProveedor,
        nombreEmpresa : $scope.nombreCliente,
        folio : $scope.folio,
        fecha : $scope.fecha,
        total : $scope.total
    }, function(error) {
      if (error) {
        // The write failed...
        $scope.error = true;
      } else {
        // Data saved successfully!
        $scope.mostrarMensaje();
      }
    });
};
}]);