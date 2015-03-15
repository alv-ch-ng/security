;(function() {

    'use strict';

    var module = angular.module('alv-ch-ng.security');

    module.factory('authInterceptor', function ($rootScope, $q, $location, localStorageService) {
        return {
            // Add authorization token to headers
            request: function (config) {
                config.headers = config.headers || {};
                var token = localStorageService.get('token');
                if (token && token.expires_at && new Date(token.expires_at).getTime() > new Date().getTime()) {
                    config.headers.Authorization = 'Bearer ' + token.access_token;
                }
                return config;
            }
        };
    });

}());


