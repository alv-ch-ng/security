;(function () {
    'use strict';

    var module = angular.module('alv-ch-ng.security');

    module.directive('anonymous', function(Principal) {
        return {
            restrict: 'A',
            link: function(scope, element) {
                scope.$watch(Principal.isAuthenticated, function( newValue ) {
                    if (newValue) {
                        element.hide();
                    } else {
                        element.show();
                    }
                });
            }
        };
    });

}());
