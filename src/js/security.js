;(function () {
    'use strict';

    var module = angular.module('alv-ch-ng.security', ['ngResource', 'LocalStorageModule', 'ab-base64']);

    module.run(function($rootScope, Principal, SecurityService) {

        $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;
            if (Principal.isIdentityResolved()) {
                SecurityService.authorize();
            }
        });
    });

}());
