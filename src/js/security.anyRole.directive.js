;(function () {
    'use strict';

    var module = angular.module('alv-ch-ng.security');

    module.directive('anyRole', function(Principal) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                scope.$watch(
                    function() {
                        return Principal.isInAnyRole(attrs.anyRole);
                    },
                    function( newValue ) {
                        if (newValue) {
                            element.show();
                        } else {
                            element.hide();
                        }
                    }
                );
            }
        };
    });

}());
