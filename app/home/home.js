'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'homeCtrl'
  });
}])

.controller('homeCtrl', ['$scope', '$firebaseObject', function($scope, $firebaseObject) {
  var ref = firebase.database().ref();
  var obj = $firebaseObject(ref);
  $scope.informacion = null;
  $scope.totalCXP = 0;
  $scope.totalCXC = 0;
  $scope.ivaCXP = 0;
  $scope.ivaCXC = 0;
  $scope.diferencia = 0;
  $scope.mes = "";
  $scope.anio = "";

  var fecha = new Date();

  $scope.parametros = {
    modelMes: fecha.getMonth(),
    modelAno: fecha.getFullYear(),
    mesOpciones: [
      {id: '0', name: 'Enero'},
      {id: '1', name: 'Febrero'},
      {id: '2', name: 'Marzo'},
      {id: '3', name: 'Abril'},
      {id: '4', name: 'Mayo'},
      {id: '5', name: 'Junio'},
      {id: '6', name: 'Julio'},
      {id: '7', name: 'Agosto'},
      {id: '8', name: 'Septiembre'},
      {id: '9', name: 'Octubre'},
      {id: '10', name: 'Noviembre'},
      {id: '11', name: 'Diciembre'}
    ],
    anoOpciones: [
      {id: fecha.getFullYear(), name: fecha.getFullYear()}
    ]
   };

   $scope.mes = $scope.parametros.mesOpciones[fecha.getMonth()].name;
   $scope.anio = fecha.getFullYear();

  obj.$loaded().then(function() {
   angular.forEach(obj, function(value, key) {
      if(key == "informacion")
      {
        value.cuentas.cuentasporpagar = convertToArray(value.cuentas.cuentasporpagar);
        value.cuentas.cuentasporcobrar = convertToArray(value.cuentas.cuentasporcobrar);
        $scope.informacion = value;
      }
   });
   $scope.calcularTotal($scope.informacion.cuentas.cuentasporpagar, "CXP");
   $scope.calcularIVA($scope.informacion.cuentas.cuentasporpagar, "CXP");
   $scope.calcularTotal($scope.informacion.cuentas.cuentasporcobrar, "CXC");
   $scope.calcularIVA($scope.informacion.cuentas.cuentasporcobrar, "CXC");
   $scope.calcularDiferencia();
 });

 $scope.calcularTotal = function(arregloCuentas, tipoCuenta) {
     var sumatotal = 0;
     angular.forEach(arregloCuentas, function(value, key) {
        var fechaCuenta = new Date(value.fecha);
        if(fecha.getMonth() == fechaCuenta.getMonth()) {
          sumatotal = sumatotal + parseInt(value.total);
        }
     });
     switch (tipoCuenta) {
        case 'CXP':
            $scope.totalCXP = sumatotal;
            break;
        case 'CXC':
            $scope.totalCXC = sumatotal;
            break;
        default:
    }
 };

 $scope.calcularIVA = function(arregloCuentas, tipoCuenta) {
    var subtotal = 0;
    var iva = 0;
    var ivaTotal = 0;
     angular.forEach(arregloCuentas, function(value, key) {
        var fechaCuenta = new Date(value.fecha);
        if(fecha.getMonth() == fechaCuenta.getMonth()) {
          subtotal = (parseFloat(value.total)/1.16);
          iva = parseFloat(value.total) - subtotal;
          ivaTotal = ivaTotal + iva;
        }
     });
     switch (tipoCuenta) {
        case 'CXP':
            $scope.ivaCXP = ivaTotal;
            break;
        case 'CXC':
            $scope.ivaCXC = ivaTotal;
            break;
        default:
    }
};

$scope.calcularDiferencia = function() {
    $scope.diferencia = $scope.ivaCXP - $scope.ivaCXC;
};

var convertToArray = function(objeto) {
  var res = [];
  for (var x in objeto){
      objeto.hasOwnProperty(x) && res.push(objeto[x])
  }
  return res;
}

 obj.$bindTo($scope, "data");
}]);