angular.module('app').controller('MyCtrl2', function($scope, version){
  //has a dependency on our version service, which we will mock out when testing this controller
  $scope.version = version + '!';
});