;(function() {

    'use strict';

    var module = angular.module('alv-ch-ng.security');

    module.directive('login', function() {

        return {
            restrict: 'E',
            replace: true,
            controller: 'SecurityCtrl',
            link: function() {



            }
        };
    });
}());


