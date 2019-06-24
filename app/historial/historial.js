'use strict';

angular.module('myApp.historial', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/consultarimpuestos', {
    templateUrl: 'historial/historial.html',
    controller: 'historialCtrl'
  });
}])

.controller('historialCtrl', ['$scope', '$firebaseObject', function($scope, $firebaseObject) {
  var ref = firebase.database().ref();

  $scope.informacion = null;
  $scope.historial = [];
  $scope.textoConsultar = "Consultar";
  $scope.loading = false;
  $scope.mes = "";
  $scope.anio = "";

  var fecha = new Date();
  $scope.parametros = {
    mesOpciones: [
      {id: '01', name: 'Enero'},
      {id: '02', name: 'Febrero'},
      {id: '03', name: 'Marzo'},
      {id: '04', name: 'Abril'},
      {id: '05', name: 'Mayo'},
      {id: '06', name: 'Junio'},
      {id: '07', name: 'Julio'},
      {id: '08', name: 'Agosto'},
      {id: '09', name: 'Septiembre'},
      {id: '10', name: 'Octubre'},
      {id: '11', name: 'Noviembre'},
      {id: '12', name: 'Diciembre'}
    ],
    anoOpciones: [
      {id: fecha.getFullYear(), name: fecha.getFullYear()}
    ]
   };

  $scope.cargarCuentas = function() {
    var obj = $firebaseObject(ref);

    obj.$loaded().then(function() {

      angular.forEach(obj, function(value, key) {
         if(key == "informacion")
         {
           value.cuentas.cuentasporcobrar = convertToArray(value.cuentas.cuentasporcobrar);
           value.cuentas.cuentasporpagar = convertToArray(value.cuentas.cuentasporpagar);
           $scope.informacion = value;
         }
     });  
    });

    obj.$bindTo($scope, "data");
  };

$scope.calcularTotal = function(arregloCuentas, tipoCuenta, mes, anio) {
    var sumatotal = 0;
    angular.forEach(arregloCuentas, function(value, key) {
       var fechaCuenta = new Date(value.fecha);
       if(parseInt(mes) == (fechaCuenta.getMonth() + 1) && parseInt(anio) == fechaCuenta.getFullYear()) {
         sumatotal = sumatotal + parseInt(value.total);
       }
    });
    return sumatotal;
};

$scope.calcularIVA = function(arregloCuentas, tipoCuenta, mes, anio) {
   var subtotal = 0;
   var iva = 0;
   var ivaTotal = 0;
    angular.forEach(arregloCuentas, function(value, key) {
       var fechaCuenta = new Date(value.fecha);
       if(parseInt(mes) == (fechaCuenta.getMonth() + 1) && parseInt(anio) == fechaCuenta.getFullYear()) {
         subtotal = (parseFloat(value.total)/1.16);
         iva = parseFloat(value.total) - subtotal;
         ivaTotal = ivaTotal + iva;
       }
    });
    return ivaTotal;
};

$scope.calcularMes = function(mes) {
    var mesName = "";
    for (var i = 0; i < $scope.parametros.mesOpciones.length; i++) {
        if($scope.parametros.mesOpciones[i].id == mes) {
            mesName = $scope.parametros.mesOpciones[i].name;
        }
    }
    return mesName;
};

$scope.calcularDiferencia = function(mes, anio, ivaCXP, ivaCXC, totalPagado, totalGastos) {
   var diferencia = ivaCXP - ivaCXC;
   var mesName = $scope.calcularMes(mes);
   $scope.historial.push({"mesanio" : mesName + "/" + anio, 
                            "impuestos" : diferencia,
                            "pagado" : totalPagado,
                            "gastos" : totalGastos})
   $scope.textoConsultar = "Consultar";
   $scope.loading = false;
   $scope.mes = "";
   $scope.anio = "";
};

  var convertToArray = function(objeto) {
    var res = [];
    for (var x in objeto){
        objeto.hasOwnProperty(x) && res.push(objeto[x])
    }
    return res;
  }

  $scope.limpiarCampos = function () { 
    $scope.textoConsultar = "Consultar";
    $scope.loading = false;
    $scope.mes = "";
    $scope.anio = "";
    $scope.historial = [];
  };

  $scope.mostrarMensaje = function() {
    $('#exampleModalCenter').modal('toggle');
  };

  $scope.consultar = function() {
    $scope.textoConsultar = "Consultando...";
    $scope.loading = true;
    var ivaCXP = 0;
    var ivaCXC = 0;
    var totalPagado = 0;
    var totalGastos = 0;

    ivaCXP = $scope.calcularIVA($scope.informacion.cuentas.cuentasporpagar, "CXP", $scope.mes, $scope.anio);
    ivaCXC = $scope.calcularIVA($scope.informacion.cuentas.cuentasporcobrar, "CXC", $scope.mes, $scope.anio);
    totalPagado = $scope.calcularTotal($scope.informacion.cuentas.cuentasporpagar, "CXP", $scope.mes, $scope.anio);
    totalGastos = $scope.calcularTotal($scope.informacion.cuentas.cuentasporcobrar, "CXC", $scope.mes, $scope.anio);

    if(ivaCXP == 0 && ivaCXC == 0)
    {
        $scope.mostrarMensaje();
    }
    else {
        $scope.calcularDiferencia($scope.mes, $scope.anio, ivaCXP, ivaCXC, totalPagado, totalGastos);
    }
  }

  $scope.cargarCuentas();
}]);