;(function () {
    'use strict';

    var module = angular.module('alv-ch-ng.security');

    module.directive('authenticated', function(Principal) {
        return {
            restrict: 'A',
            link: function(scope, element) {
                element.hide();
                scope.$watch(Principal.isAuthenticated, function() {
                    if (Principal.authenticated) {
                        element.show();
                    } else {
                        element.hide();
                    }
                });
            }
        };
    });

}());
