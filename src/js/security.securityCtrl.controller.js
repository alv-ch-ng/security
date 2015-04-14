;(function() {

    'use strict';

    var module = angular.module('alv-ch-ng.security');

    module.controller('SecurityCtrl', ['$scope', 'SecurityService', function($scope, SecurityService) {

        $scope.credentials = {
            username: '',
            password: '',
            rememberMe: false
        };

        $scope.login = function() {
            SecurityService.login($scope.credentials);
        };

        $scope.logout = function() {
            SecurityService.logout();
            $scope.credentials = {
                username: '',
                password: '',
                rememberMe: false
            };
        };

    }]);
}());


