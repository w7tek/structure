/* Declare app module that has dependency on ngResource */
angular.module('app', []).
    config(function (navModel, $routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        //setup URL routes
        $routeProvider.when(navModel['Aleph'], {templateUrl: 'templates/partial1.html', controller: 'MyCtrl1'});
        $routeProvider.when(navModel['Bet'], {templateUrl: 'templates/partial2.html', controller: 'MyCtrl2'});
        $routeProvider.otherwise({redirectTo: navModel['Aleph']});
    });
