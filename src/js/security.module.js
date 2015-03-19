;(function () {
    'use strict';

    angular.module('alv-ch-ng.core', []);
    var module = angular.module('alv-ch-ng.security', ['alv-ch-ng.core', 'ngResource', 'LocalStorageModule', 'ab-base64']);

    module.config(function($httpProvider) {
        $httpProvider.defaults.headers.useXDomain = true;
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.interceptors.push('authInterceptor');
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $httpProvider.defaults.headers.common['If-Modified-Since'] = '01 Jan 1970 00:00:00 GMT';
    });

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
