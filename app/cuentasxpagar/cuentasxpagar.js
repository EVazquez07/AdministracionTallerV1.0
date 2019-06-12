'use strict';

angular.module('myApp.cuentasxpagar', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/cuentasxpagar', {
    templateUrl: 'cuentasxpagar/cuentasxpagar.html',
    controller: 'cuentasxpagarCtrl'
  })
  .when('/cuentasxpagarnuevo', {
    templateUrl: 'cuentasxpagar/cuentasxpagarnuevo.html',
    controller: 'cuentasxpagarnuevoCtrl'
  });
}])

.controller('cuentasxpagarCtrl', ['$scope', '$firebaseObject', function($scope, $firebaseObject) {
  var ref = firebase.database().ref();

  $scope.informacion = null;

  $scope.cargarCuentas = function() {
    var obj = $firebaseObject(ref);

    obj.$loaded().then(function() {

      angular.forEach(obj, function(value, key) {
        console.log("Value -> ", value);
         if(key == "informacion")
         {
           value.cuentas.cuentasporpagar = convertToArray(value.cuentas.cuentasporpagar);
           $scope.informacion = value;
         }
     });   

      console.log("Data -> ", $scope.informacion);
      console.log("Data C-> ", $scope.informacion.clientes);
      console.log("Data P-> ", $scope.informacion.proveedores);
      console.log("Data CN-> ", $scope.informacion.cuentas);
      console.log("Data CNXP-> ", $scope.informacion.cuentas.cuentasporpagar);
      console.log("Data CNXC-> ", $scope.informacion.cuentas.cuentasporcobrar);

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
.controller('cuentasxpagarnuevoCtrl', ['$scope', '$firebaseObject', '$route', function($scope, $firebaseObject, $route) {
  var ref = firebase.database().ref();

  $scope.informacion = null;
  $scope.nombreCliente = "";
  $scope.idCliente = "";
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
    angular.forEach($scope.informacion.clientes,function(cliente){
      if(cliente.nombre.toLowerCase().indexOf(string.toLowerCase())>=0){
        output.push(cliente);
      }
    });
    $scope.filterCliente=output;
  }

  $scope.fillTextbox=function(cliente){
    $scope.nombreCliente = cliente.nombre;
    $scope.idCliente = cliente.id;
    $scope.filterCliente = null;
  }

  $scope.mostrarMensaje = function() {
    $('#exampleModalCenter').modal('toggle');
  };

  $scope.limpiarCampos = function () { 
    $scope.textoGuardar = "Guardar";
    $scope.loading = false;
    $scope.nombreCliente = "";
    $scope.idCliente = "";
    $scope.folio = "";
    $scope.fecha = "";
    $scope.total = "";
    $scope.error = false;
  };

  $scope.guardar = function() {
    $scope.textoGuardar = "Guardando...";
    $scope.loading = true;
    firebase.database().ref('informacion/cuentas/cuentasporpagar').push().set({
        idCliente : $scope.idCliente,
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