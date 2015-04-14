;(function() {

    'use strict';

    var module = angular.module('alv-ch-ng.security');

    module.controller('LoginCtrl', ['$scope', '$timeout', 'SecurityService', function($scope, $timeout, SecurityService) {

        $scope.userName = '';
        $scope.password = '';
        $scope.rememberMe = true;

        $scope.errors = {};

        $timeout(function () {
            angular.element('[ng-model="username"]').focus();
        });

        $scope.login = function () {
            SecurityService.login({
                username: $scope.username,
                password: $scope.password,
                rememberMe: $scope.rememberMe
            });
        };

    }]);
}());


